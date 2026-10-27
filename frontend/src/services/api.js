
const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})

  if (
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.detail || `API error ${response.status}`)
  }

  return data
}

export const api = {
  // Login validated by FastAPI
  login: (role, credentials) =>
    request(`/auth/${encodeURIComponent(role)}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getAlerts: () => request('/alerts'),

  getInsights: () => request('/insights'),

  getTrend: (range = '1h') =>
    request(`/insights/trend?range=${encodeURIComponent(range)}`),

  getRoutes: (from, to) =>
    request(
      `/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    ),

  getCases: () => request('/cases'),

  getWeather: () => request('/weather'),
}

// Upload a CSV dataset
export async function uploadDataset(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request('/datasets/upload', {
    method: 'POST',
    body: formData,
  })
}

// Analyze an uploaded dataset
export async function analyzeDataset(
  filename,
  target = '',
  model = 'auto'
) {
  const formData = new FormData()
  formData.append('filename', filename)
  formData.append('model', model)

  if (target) {
    formData.append('target', target)
  }

  return request('/datasets/analyze', {
    method: 'POST',
    body: formData,
  })
}

// WebSocket connection for live updates
export const openLiveSocket = (onMessage) => {
  const url =
    import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws'

  const socket = new WebSocket(url)

  socket.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data))
    } catch (error) {
      console.error('Invalid WebSocket message:', error)
    }
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  return socket
}
