from pathlib import Path
from typing import Optional
import json
import os
import secrets

import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

BASE = Path(__file__).resolve().parent
DATA_DIR = BASE / "datasets"
MODEL_DIR = BASE / "models"

DATA_DIR.mkdir(exist_ok=True)
MODEL_DIR.mkdir(exist_ok=True)

app = FastAPI(
    title="IntelliTraffic AI API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "IntelliTraffic AI API",
        "docs": "/docs",
        "dataset_upload": "/datasets/upload",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# -------------------------------------------------------------------
# Demo role-based login
# Configure these environment variables before deployment.
# Defaults are intended only for local project demonstrations.
# -------------------------------------------------------------------

class LoginRequest(BaseModel):
    username: str
    password: str


DEMO_USERS = {
    "officer": {
        "username": os.getenv("OFFICER_USERNAME", "officer01"),
        "password": os.getenv("OFFICER_PASSWORD", "Officer@123"),
    },
    "emergency": {
        "username": os.getenv("EMERGENCY_USERNAME", "emergency01"),
        "password": os.getenv("EMERGENCY_PASSWORD", "Emergency@123"),
    },
}


@app.post("/auth/{role}/login")
def login(role: str, data: LoginRequest):
    role = role.lower()

    if role not in DEMO_USERS:
        raise HTTPException(
            status_code=404,
            detail="Unknown login role",
        )

    account = DEMO_USERS[role]

    username_ok = secrets.compare_digest(
        data.username, account["username"]
    )
    password_ok = secrets.compare_digest(
        data.password, account["password"]
    )

    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    return {
        "success": True,
        "role": role,
        "message": "Login successful",
    }



@app.post("/datasets/upload")
async def upload_dataset(file: UploadFile = File(...)):
    name = Path(file.filename or "dataset.csv").name

    if not name.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Upload a CSV dataset for this endpoint.",
        )

    content = await file.read()

    if len(content) > 100 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="CSV must be 100 MB or smaller.",
        )

    dest = DATA_DIR / name

    try:
        df = pd.read_csv(pd.io.common.BytesIO(content))
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read CSV: {exc}",
        )

    # Save only after the CSV has been parsed successfully.
    dest.write_bytes(content)

    preview_df = df.head(5).astype(object).where(
        pd.notna(df.head(5)), None
    )

    return {
        "filename": name,
        "rows": int(len(df)),
        "columns": list(df.columns),
        "preview": preview_df.to_dict(orient="records"),
        "profile": profile_df(df),
    }


@app.get("/datasets")
def list_datasets():
    result = []

    for path in sorted(DATA_DIR.glob("*.csv")):
        try:
            df = pd.read_csv(path, nrows=10000)

            result.append({
                "filename": path.name,
                "columns": list(df.columns),
                "rows_sampled": len(df),
            })
        except Exception:
            result.append({
                "filename": path.name,
                "error": "Unable to parse CSV",
            })

    return result


@app.post("/datasets/analyze")
def analyze_dataset(
    filename: str = Form(...),
    target: Optional[str] = Form(None),
    model: str = Form("auto"),
):
    path = DATA_DIR / Path(filename).name

    if not path.exists() or path.suffix.lower() != ".csv":
        raise HTTPException(
            status_code=404,
            detail="Dataset not found. Upload it first.",
        )

    if model not in {"auto", "lightgbm", "xgboost"}:
        raise HTTPException(
            status_code=400,
            detail="Model must be auto, lightgbm, or xgboost.",
        )

    try:
        df = pd.read_csv(path)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read dataset: {exc}",
        )

    result = {
        "filename": path.name,
        "profile": profile_df(df),
        "insights": basic_insights(df),
        "model": {
            "status": "not trained",
            "note": (
                "Provide a valid target column for supervised "
                "model training."
            ),
        },
    }

    if target:
        if target not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{target}' not found.",
            )

        result["model"] = train_tabular(
            df,
            target,
            model,
            path.stem,
        )

    return result


@app.get("/insights")
def insights():
    datasets = list(DATA_DIR.glob("*.csv"))

    if not datasets:
        return {
            "status": "waiting_for_dataset",
            "message": "Upload a CSV dataset to generate insights.",
            "insights": [],
        }

    path = sorted(datasets)[0]

    try:
        df = pd.read_csv(path)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read dataset: {exc}",
        )

    return {
        "status": "ok",
        "dataset": path.name,
        "profile": profile_df(df),
        "insights": basic_insights(df),
    }


def profile_df(df):
    summary = df.describe(
        include="all"
    ).transpose()

    summary = summary.astype(object).where(
        pd.notna(summary), None
    )

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "missing_values": {
            str(key): int(value)
            for key, value in df.isna().sum().items()
        },
        "numeric_summary": summary.to_dict(orient="index"),
        "column_types": {
            str(key): str(value)
            for key, value in df.dtypes.items()
        },
    }


def basic_insights(df):
    insights = []
    numeric = df.select_dtypes(include="number")

    for column in numeric.columns:
        series = numeric[column].dropna()

        if not series.empty:
            insights.append({
                "title": f"{column}: summary",
                "value": round(float(series.mean()), 3),
                "detail": (
                    f"Mean across {len(series)} non-missing rows; "
                    f"range {series.min()} to {series.max()}."
                ),
            })

    missing = df.isna().sum()

    if missing.sum():
        column = str(missing.idxmax())

        insights.append({
            "title": "Data quality",
            "value": int(missing.sum()),
            "detail": (
                f"Missing cells detected. Column with most missing "
                f"values: {column} ({int(missing[column])})."
            ),
        })

    if not insights:
        insights.append({
            "title": "Dataset loaded",
            "value": int(len(df)),
            "detail": (
                "No numeric columns found. Basic statistical "
                "insights need numeric traffic or incident fields."
            ),
        })

    return insights[:30]


def train_tabular(df, target, model_name, stem):
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import (
        accuracy_score,
        mean_absolute_error,
        r2_score,
    )
    from sklearn.preprocessing import (
        LabelEncoder,
        OneHotEncoder,
    )
    from sklearn.impute import SimpleImputer
    from sklearn.pipeline import make_pipeline
    from sklearn.ensemble import (
        RandomForestClassifier,
        RandomForestRegressor,
    )
    from sklearn.compose import ColumnTransformer

    work = df.dropna(subset=[target]).copy()

    if len(work) < 10:
        return {
            "status": "insufficient_data",
            "note": "At least 10 labelled rows are recommended.",
        }

    y = work.pop(target)

    if y.nunique() < 2:
        return {
            "status": "invalid_target",
            "note": "Target needs at least two distinct values.",
        }

    categorical = work.select_dtypes(
        exclude="number"
    ).columns.tolist()

    numeric = work.select_dtypes(
        include="number"
    ).columns.tolist()

    if not categorical and not numeric:
        return {
            "status": "no_features",
            "note": "No usable feature columns found.",
        }

    is_classification = (
        y.dtype == "object"
        or y.dtype.name == "category"
        or y.nunique() <= 20
    )

    if is_classification:
        encoder = LabelEncoder()
        y = pd.Series(
            encoder.fit_transform(y.astype(str)),
            index=y.index,
        )
    else:
        y = pd.to_numeric(y, errors="coerce")
        valid = y.notna()
        work = work.loc[valid]
        y = y.loc[valid]

    transformers = []

    if numeric:
        transformers.append((
            "num",
            make_pipeline(
                SimpleImputer(strategy="median")
            ),
            numeric,
        ))

    if categorical:
        transformers.append((
            "cat",
            make_pipeline(
                SimpleImputer(strategy="most_frequent"),
                OneHotEncoder(handle_unknown="ignore"),
            ),
            categorical,
        ))

    preprocessor = ColumnTransformer(transformers)

    estimator = None
    used = None

    if model_name in ("lightgbm", "auto"):
        try:
            if is_classification:
                from lightgbm import LGBMClassifier
                estimator = LGBMClassifier(
                    n_estimators=150,
                    verbosity=-1,
                    random_state=42,
                )
            else:
                from lightgbm import LGBMRegressor
                estimator = LGBMRegressor(
                    n_estimators=150,
                    verbosity=-1,
                    random_state=42,
                )

            used = "LightGBM"

        except ImportError:
            if model_name == "lightgbm":
                return {
                    "status": "dependency_missing",
                    "error": "Install lightgbm to use this model.",
                }

    if estimator is None and model_name in ("xgboost", "auto"):
        try:
            if is_classification:
                from xgboost import XGBClassifier
                estimator = XGBClassifier(
                    n_estimators=120,
                    max_depth=4,
                    eval_metric="mlogloss",
                    random_state=42,
                )
            else:
                from xgboost import XGBRegressor
                estimator = XGBRegressor(
                    n_estimators=120,
                    max_depth=4,
                    random_state=42,
                )

            used = "XGBoost"

        except ImportError:
            if model_name == "xgboost":
                return {
                    "status": "dependency_missing",
                    "error": "Install xgboost to use this model.",
                }

    if estimator is None:
        estimator = (
            RandomForestClassifier(
                n_estimators=120,
                random_state=42,
            )
            if is_classification
            else RandomForestRegressor(
                n_estimators=120,
                random_state=42,
            )
        )
        used = "RandomForest fallback"

    try:
        stratify = None

        if is_classification:
            class_counts = y.value_counts()
            if len(class_counts) > 1 and class_counts.min() >= 2:
                stratify = y

        X_train, X_test, y_train, y_test = train_test_split(
            work,
            y,
            test_size=0.2,
            random_state=42,
            stratify=stratify,
        )

        pipeline = make_pipeline(preprocessor, estimator)
        pipeline.fit(X_train, y_train)
        predictions = pipeline.predict(X_test)

        if is_classification:
            metrics = {
                "accuracy": round(
                    float(accuracy_score(y_test, predictions)), 4
                ),
            }
        else:
            metrics = {
                "mae": round(
                    float(mean_absolute_error(y_test, predictions)), 4
                ),
                "r2": round(
                    float(r2_score(y_test, predictions)), 4
                ),
            }

        safe_stem = "".join(
            character if character.isalnum() or character in "-_"
            else "_"
            for character in f"{stem}_{target}"
        )

        import joblib
        joblib.dump(
            pipeline,
            MODEL_DIR / f"{safe_stem}_model.joblib",
        )

        explainability = (
            "SHAP explanations have not been calculated for this model."
        )

        try:
            import shap  # noqa: F401
            explainability = (
                "SHAP is installed, but feature attribution still "
                "needs to be calculated separately."
            )
        except ImportError:
            pass

        return {
            "status": "trained",
            "algorithm": used,
            "target": target,
            "task": (
                "classification"
                if is_classification
                else "regression"
            ),
            "rows_used": int(len(work)),
            "metrics": metrics,
            "explainability": explainability,
            "caution": (
                "Prototype evaluation only. Check data leakage, "
                "class balance, time-aware validation, and "
                "domain-specific metrics before relying on predictions."
            ),
        }

    except Exception as exc:
        return {
            "status": "training_failed",
            "algorithm": used or model_name,
            "error": str(exc),
        }


@app.post("/cases/{case_id}/commit")
def commit_case(case_id: str):
    # Demo only: connect a database and authorization before deployment.
    return {
        "case_id": case_id,
        "status": "accepted",
        "message": "Demo only; no database record was persisted.",
    }


@app.get("/routes/demo")
def demo_routes():
    return {
        "status": "demo",
        "actual": {
            "minutes": 12,
            "km": 4.2,
        },
        "predicted": {
            "minutes": 10,
            "km": 4.8,
        },
        "note": (
            "Placeholder values. Integrate a routing provider and "
            "trained ETA model for real estimates."
        ),
    }


@app.post("/vision/yolo")
async def yolo_detect(file: UploadFile = File(...)):
    """Optional YOLOv8 inference using backend/models/best.pt."""
    weights = MODEL_DIR / "best.pt"

    if not weights.exists():
        raise HTTPException(
            status_code=503,
            detail="Add trained YOLOv8 weights at backend/models/best.pt.",
        )

    try:
        from ultralytics import YOLO
        from PIL import Image
        import io

        image = Image.open(
            io.BytesIO(await file.read())
        ).convert("RGB")

        results = YOLO(str(weights)).predict(
            image,
            verbose=False,
        )

        detections = []

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])

                detections.append({
                    "class_id": class_id,
                    "class_name": result.names.get(
                        class_id, str(class_id)
                    ),
                    "confidence": round(float(box.conf[0]), 4),
                    "xyxy": [
                        round(float(value), 2)
                        for value in box.xyxy[0].tolist()
                    ],
                })

        return {
            "model": "YOLOv8",
            "detections": detections,
            "count": len(detections),
        }

    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Install ultralytics and pillow for YOLOv8 inference.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Image inference failed: {exc}",
        )


@app.post("/vision/efficientnet")
async def efficientnet_classify(file: UploadFile = File(...)):
    """Optional EfficientNet-B0 classification with trained weights."""
    weights = MODEL_DIR / "efficientnet.pth"
    labels_path = MODEL_DIR / "efficientnet_labels.json"

    if not weights.exists():
        raise HTTPException(
            status_code=503,
            detail=(
                "Add compatible trained weights at "
                "backend/models/efficientnet.pth."
            ),
        )

    try:
        import io
        from PIL import Image
        import torch
        from torchvision import models, transforms

        image = Image.open(
            io.BytesIO(await file.read())
        ).convert("RGB")

        labels = (
            json.loads(labels_path.read_text())
            if labels_path.exists()
            else []
        )

        model = models.efficientnet_b0(weights=None)

        if labels:
            model.classifier[1] = torch.nn.Linear(
                model.classifier[1].in_features,
                len(labels),
            )

        model.load_state_dict(
            torch.load(weights, map_location="cpu")
        )
        model.eval()

        transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                [0.485, 0.456, 0.406],
                [0.229, 0.224, 0.225],
            ),
        ])

        with torch.no_grad():
            scores = torch.softmax(
                model(transform(image).unsqueeze(0))[0],
                dim=0,
            )

        values, indices = torch.topk(
            scores,
            min(5, len(scores)),
        )

        predictions = [
            {
                "class_id": int(index),
                "label": (
                    labels[int(index)]
                    if labels and int(index) < len(labels)
                    else str(int(index))
                ),
                "confidence": round(float(value), 4),
            }
            for value, index in zip(values, indices)
        ]

        return {
            "model": "EfficientNet-B0",
            "predictions": predictions,
        }

    except ImportError:
        raise HTTPException(
            status_code=503,
            detail=(
                "Install torch, torchvision and pillow "
                "to enable EfficientNet inference."
            ),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Image classification failed: {exc}",
        )