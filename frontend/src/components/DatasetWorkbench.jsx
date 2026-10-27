import { useState } from 'react'
import { uploadDataset, analyzeDataset } from '../services/api.js'

export default function DatasetWorkbench() {
  const [file, setFile] = useState(null)
  const [uploaded, setUploaded] = useState(null)
  const [target, setTarget] = useState('')
  const [model, setModel] = useState('auto')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleUpload() {
    if (!file) {
      setError('Please choose a CSV file first.')
      return
    }

    setBusy(true)
    setError('')
    setMessage('Uploading CSV...')
    setUploaded(null)
    setResult(null)

    try {
      const data = await uploadDataset(file)
      setUploaded(data)
      setMessage('CSV uploaded successfully.')
    } catch (err) {
      setError(err.message || 'Upload failed. Check the backend.')
      setMessage('')
    } finally {
      setBusy(false)
    }
  }

  async function handleAnalyze() {
    if (!uploaded) {
      setError('Upload a dataset first.')
      return
    }

    setBusy(true)
    setError('')
    setMessage('Analyzing dataset...')

    try {
      const data = await analyzeDataset(
        uploaded.filename,
        target,
        model
      )
      setResult(data)
      setMessage('Analysis completed.')
    } catch (err) {
      setError(err.message || 'Analysis failed.')
      setMessage('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 text-gray-900">
      <h2 className="text-xl font-bold">Dataset and ML Analysis</h2>

      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null)
          setError('')
          setMessage('')
          setUploaded(null)
          setResult(null)
        }}
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={busy}
        className="rounded-lg bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? 'Please wait...' : 'Upload CSV'}
      </button>

      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}

      {uploaded && (
        <div className="space-y-3">
          <p>
            Uploaded: <strong>{uploaded.filename}</strong>
          </p>
          <p>
            Rows: {uploaded.rows} | Columns: {uploaded.columns.length}
          </p>

          <label className="block text-sm font-medium">
            Target column (optional)
          </label>

          <select
            className="w-full rounded-lg border p-2"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          >
            <option value="">Profile only — no model training</option>
            {uploaded.columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="auto">Automatic model selection</option>
            <option value="lightgbm">LightGBM</option>
            <option value="xgboost">XGBoost</option>
          </select>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={busy}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Analyze Dataset
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          <h3 className="font-bold">Analysis results</h3>
          <pre className="overflow-auto whitespace-pre-wrap text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  )
}