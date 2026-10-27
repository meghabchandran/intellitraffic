import { useState } from 'react'
import TrafficMap from '../components/maps/TrafficMap.jsx'
import GoogleMapSlot from '../components/maps/GoogleMapSlot.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, routes } from '../data/mock.js'

export default function PublicDashboard() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [active, setActive] = useState(1)
  const [showRoute, setShowRoute] = useState(false)

  const field =
    'w-full rounded-xl bg-white/15 px-5 py-3 text-base outline-none placeholder-white'

  return (
    <div className="flex h-full min-h-0">
      <GoogleMapSlot
        id="public-google-map"
        label="Public Google Maps slot"
        className="flex-1"
      >
        <div className="absolute left-6 top-6 z-[1000] w-[min(32rem,85%)] space-y-3 rounded-2xl bg-black/75 p-4 backdrop-blur">
          <input
            className={field}
            placeholder="Your location (demo text)"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value)
              setShowRoute(false)
            }}
          />

          <input
            className={field}
            placeholder="Destination (demo text)"
            value={to}
            onChange={(event) => {
              setTo(event.target.value)
              setShowRoute(false)
            }}
          />

          <button
            onClick={() =>
              setShowRoute(Boolean(from.trim() && to.trim()))
            }
            className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-black"
          >
            Show route comparison
          </button>

          {showRoute && (
            <p className="rounded-lg bg-white/10 p-2 text-sm text-white">
              Route comparison requested from {from} to {to}.
              Connect a routing API to calculate the actual route.
            </p>
          )}

          <p className="text-xs text-white/70">
            Map currently uses sample coordinates. Text inputs are
            not geocoded; connect Google Maps routing for real routes.
          </p>
        </div>
      </GoogleMapSlot>

      <div className="flex w-[28rem] shrink-0 flex-col">
        <Panel title="Alerts" className="rounded-none border-0 border-l">
          {alerts.slice(0, 2).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </Panel>

        <div className="flex border-b border-white/10 bg-black/40 text-center">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setActive(route.id)}
              className={`flex-1 py-2 ${
                active === route.id
                  ? 'bg-emerald-500 font-semibold'
                  : 'text-cyan-300'
              }`}
            >
              <div>{route.min} min</div>
              <div className="text-sm">{route.miles} miles</div>
            </button>
          ))}
        </div>

        <TrafficMap
          id="public-route-map"
          label="Actual and predicted route comparison"
          zoom={false}
          showRoutes
          className="min-h-[260px] flex-1"
        />

        <div className="border-t border-white/10 bg-black/40 p-3 text-sm text-white/70">
          Green: actual/current route. Purple dashed: predicted
          alternative. Times are placeholders until routing and
          prediction APIs are connected.
        </div>
      </div>
    </div>
  )
}