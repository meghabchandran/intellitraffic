import { useState } from 'react'
import TrafficMap from '../components/maps/TrafficMap.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, cases } from '../data/mock.js'

export default function EmergencyDashboard() {
  const [committed, setCommitted] = useState(false)
  const [selectedCase, setSelectedCase] = useState(
    cases[0]?.id ?? null
  )

  return (
    <div className="flex h-full min-h-0">
      <div className="flex w-[48%] shrink-0 flex-col min-h-0">
        <TrafficMap
          id="emergency-traffic-map"
          label="Emergency traffic and ambulance map"
          live
          showAmbulances
          className="min-h-[280px] flex-[3]"
        />

        <div className="flex min-h-0 flex-[2] overflow-y-auto border-t border-white/10">
          <Panel
            title="Alerts"
            className="flex-1 rounded-none border-0 border-r"
          >
            {alerts.slice(0, 2).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </Panel>

          <Panel
            title="Incident cases"
            className="flex-1 rounded-none border-0"
          >
            {cases.map((incident) => (
              <button
                key={incident.id}
                onClick={() => {
                  setSelectedCase(incident.id)
                  setCommitted(false)
                }}
                className={`mb-2 w-full rounded-xl border p-3 text-left ${
                  selectedCase === incident.id
                    ? 'border-emerald-400 bg-emerald-950/50'
                    : 'border-white/10'
                }`}
              >
                <div className="font-semibold">{incident.type}</div>
                <div className="text-sm text-white/60">
                  {incident.place}
                </div>
                <div className="text-xs text-white/50">
                  {incident.ago}
                </div>
              </button>
            ))}

            <div className="flex justify-around gap-2 pt-3">
              <button
                onClick={() => setCommitted(true)}
                disabled={!selectedCase}
                className="rounded-full border border-green-400 bg-green-900/60 px-5 py-2 font-medium text-green-300 disabled:opacity-40"
              >
                Commit
              </button>

              <button
                onClick={() => {
                  setCommitted(false)
                  setSelectedCase(null)
                }}
                className="rounded-full border border-red-400 bg-red-900/60 px-5 py-2 font-medium text-red-300"
              >
                Report / Clear
              </button>
            </div>

            {committed && (
              <p className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
                Case accepted in this demo. Nearby hospital markers
                are shown on the map. Connect the backend to persist
                case status.
              </p>
            )}
          </Panel>
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <TrafficMap
          id="emergency-hospital-map"
          label="Nearby hospitals and ambulance route"
          showHospitals={committed}
          showAmbulances
          showRoutes={committed}
          live={committed}
          className="h-full w-full"
        />

        {!committed && (
          <div className="pointer-events-none absolute bottom-5 left-5 z-[1000] rounded-xl bg-black/75 px-4 py-3 text-sm text-white">
            Select an incident and click <strong>Commit</strong> to
            display nearby hospital options and demo route overlays.
          </div>
        )}

        {committed && (
          <div className="pointer-events-none absolute left-4 top-14 z-[1000] rounded-xl bg-black/75 p-3 text-sm text-white">
            <div className="mb-1 font-semibold">Route legend</div>
            <div className="text-emerald-300">
              ━ Actual/current route · 12 min / 4.2 km
            </div>
            <div className="text-purple-300">
              ┄ Predicted alternative · 10 min / 4.8 km
            </div>
            <div className="mt-1 text-xs text-white/60">
              Illustrative values, not live routing estimates.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}