// Single place for all backend calls. Swap the mock data for these later.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  login: (role, body) => request(`/auth/${role}/login`, { method: 'POST', body: JSON.stringify(body) }),
  getAlerts: () => request('/alerts'),
  getInsights: () => request('/insights'),
  getTrend: (range = '1h') => request(`/insights/trend?range=${range}`),
  getRoutes: (from, to) => request(`/routes?from=${from}&to=${to}`),
  getCases: () => request('/cases'),
  getWeather: () => request('/weather'),
}

// Real-time traffic / ambulance updates (later)
export const openLiveSocket = (onMessage) => {
  const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws')
  ws.onmessage = (e) => onMessage(JSON.parse(e.data))
  return ws
}
