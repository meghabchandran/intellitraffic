#  IntelliTraffic AI



IntelliTraffic AI is an AI-powered traffic intelligence platform that understands, predicts and responds to changing road conditions. Its focus is **emergency mobility**: helping ambulances and traffic authorities make faster, data-driven decisions when every minute matters.

---

##  Features

| Role | What they get |
|---|---|
| **Traffic Officer** | Live traffic map, live EV tracking, alerts, live insights (flow, speed, congestion, delay), traffic trend, AI-recommended actions |
| **Emergency Services** | Live traffic map, nearby hospitals, incident cases (Commit / Report), fastest ambulance routing |
| **Public** | Live traffic map, route planning with alternatives (time and distance), real-time alerts |

All roles: weather and date/time header, notification preferences, role-based login.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite, JavaScript), Tailwind CSS, React Router, Recharts, lucide-react |
| Maps | MapLibre GL JS / Leaflet *(to be integrated)* |
| Backend | Python, FastAPI, WebSockets *(in progress)* |
| AI / ML | CNN models (traffic and vehicle detection), congestion prediction, LLM-based recommendations |
| Data | PostgreSQL (+ PostGIS), Weather API |
| Auth | JWT with role-based access (Officer / Emergency / Public) |

---

## Project Structure

```
intellitrafic/
├── frontend/          # React app (UI, pages, components)
│   └── src/
│       ├── components/   # Sidebar, TopBar, MapSlot, Panel, ...
│       ├── layouts/      # DashboardLayout
│       ├── pages/        # Home, Login, Dashboards, Settings
│       ├── services/     # api.js (REST + WebSocket)
│       ├── data/         # mock data (until backend is ready)
│       └── hooks/
├── backend/           # FastAPI server, ML models, LLM, integrations
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Frontend
```bash
cd frontend
npm install
cp .env.example .env     # set API / WebSocket URLs
npm run dev              # http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload       # http://localhost:8000
```

### Environment variables (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_MAP_TOKEN=
```

---

## 🗺️ App Routes

| Page | Route |
|---|---|
| Home | `/` |
| Officer / Emergency login | `/login/officer`, `/login/emergency` |
| Public dashboard | `/public` |
| Officer dashboard | `/officer/dashboard` |
| Emergency dashboard | `/emergency/dashboard` |
| Settings | `/<role>/settings` |

---

