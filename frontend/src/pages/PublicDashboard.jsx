import { useState } from 'react'
import MapSlot from '../components/MapSlot.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, routes } from '../data/mock.js'

export default function PublicDashboard() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [active, setActive] = useState(1)
  const field = 'w-full rounded-xl bg-white/15 px-6 py-4 text-lg outline-none placeholder-white'

  return (
    <div className="flex h-full">
      <MapSlot id="public-main-map" label="Live traffic map" className="flex-1">
        <div className="absolute left-6 top-6 z-10 w-[32rem] space-y-3 rounded-2xl bg-black/40 p-4 backdrop-blur">
          <input className={field} placeholder="Your Location" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className={field} placeholder="Your Destination" value={to} onChange={(e) => setTo(e.target.value)} />
          {/* TODO: on submit -> api.getRoutes(from, to) */}
        </div>
      </MapSlot>

      <div className="flex w-[28rem] shrink-0 flex-col">
        <Panel title="Alerts" className="rounded-none border-0 border-l">
          {alerts.slice(0, 2).map((a) => <AlertCard key={a.id} alert={a} />)}
        </Panel>

        <div className="flex border-b border-white/10 bg-black/40 text-center">
          {routes.map((r) => (
            <button key={r.id} onClick={() => setActive(r.id)}
              className={`flex-1 py-2 ${active === r.id ? 'bg-emerald-500 font-semibold' : 'text-cyan-300'}`}>
              <div className="text-xl">{r.min} min</div>
              <div className="text-sm">{r.miles} miles</div>
            </button>
          ))}
        </div>
        <MapSlot id="public-route-map" label="Route preview" zoom={false} className="flex-1" />
      </div>
    </div>
  )
}
