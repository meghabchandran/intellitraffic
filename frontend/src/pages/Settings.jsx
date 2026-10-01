import { useState } from 'react'
import { UserCircle } from 'lucide-react'
import Toggle from '../components/Toggle.jsx'

const PREFS = [
  { key: 'traffic', title: 'Traffic Alerts', desc: 'Receive congestion and incident alerts' },
  { key: 'ev', title: 'Emergency Vehicle Alerts', desc: 'Receive emergency vehicle notifications' },
  { key: 'ai', title: 'AI Recommendations', desc: 'Receive recommended traffic actions' },
]

export default function Settings() {
  const [prefs, setPrefs] = useState({ traffic: true, ev: true, ai: true })

  return (
    <div className="flex h-full items-start justify-center overflow-y-auto bg-black/30 p-10">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-surface p-12">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-white/70">Your account Information</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <UserCircle size={80} strokeWidth={1.5} />
            <div>
              <div className="text-lg font-medium">Admin User</div>
              <div className="text-white/70">Traffic Control Authority</div>
              <div className="text-white/70">admin@intellitraffic.ai</div>
            </div>
          </div>
          <button className="rounded-full bg-white/10 px-8 py-3 font-medium">Edit Profile</button>
        </div>

        <hr className="my-8 border-white/10" />

        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="text-white/70">Manage what alert you receive</p>
        <ul className="mt-4 divide-y divide-white/10">
          {PREFS.map((p) => (
            <li key={p.key} className="flex items-center justify-between py-4">
              <div>
                <div className="text-lg font-medium">{p.title}</div>
                <div className="text-white/70">{p.desc}</div>
              </div>
              <Toggle checked={prefs[p.key]} onChange={(v) => setPrefs({ ...prefs, [p.key]: v })} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
