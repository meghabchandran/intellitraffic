
import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { CarFront, Ambulance } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import { api } from '../services/api.js'

const ROLES = {
  officer: {
    title: 'Login as Officer',
    icon: CarFront,
    next: '/officer/dashboard',
  },
  emergency: {
    title: 'Login as Emergency',
    icon: Ambulance,
    next: '/emergency/dashboard',
  },
}

export default function Login() {
  const { role } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const cfg = ROLES[role]

  if (!cfg) return <Navigate to="/" replace />

  const Icon = cfg.icon

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.login(role, form)

      if (data.success && data.role === role) {
        navigate(cfg.next)
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Please ensure the backend is running.'
          : err.message || 'Invalid username or password'
      )
    } finally {
      setLoading(false)
    }
  }

  const input =
    'w-full rounded-full bg-black/40 px-8 py-5 text-base font-medium placeholder-white outline-none focus:ring-2 focus:ring-accent'

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-bg to-[#3a2d4d]">
      <SiteHeader showLogo={false} showLogin />

      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={submit}
          className="w-full max-w-xl rounded-[3rem] bg-white/15 p-12 backdrop-blur"
        >
          <div className="flex items-center justify-center gap-4 rounded-full bg-black/30 py-4 text-2xl font-semibold tracking-widest">
            {cfg.title}
            <Icon size={40} />
          </div>

          <div className="mt-24 space-y-6">
            <input
              className={input}
              placeholder="Username"
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />

            <input
              className={input}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            {error && (
              <p role="alert" className="text-center text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent/60 py-5 text-2xl font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Submit'}
            </button>

            <button
              type="button"
              onClick={() =>
                setError('Please contact the administrator to reset your password.')
              }
              className="mx-auto block text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
