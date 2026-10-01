import MapSlot from '../components/MapSlot.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, cases } from '../data/mock.js'

export default function EmergencyDashboard() {
  return (
    <div className="flex h-full">
      <div className="flex w-[48%] shrink-0 flex-col">
        <MapSlot id="emergency-traffic-map" label="Live traffic map" live className="flex-[3]" />
        <div className="flex flex-[2] overflow-y-auto border-t border-white/10">
          <Panel title="Alerts" className="flex-1 rounded-none border-0 border-r">
            {alerts.slice(0, 2).map((a) => <AlertCard key={a.id} alert={a} />)}
          </Panel>
          <Panel title="Cases" className="flex-1 rounded-none border-0">
            {cases.map((c) => <AlertCard key={c.id} alert={c} />)}
            <div className="flex justify-around pt-4">
              <button className="rounded-full border border-green-400 bg-green-900/60 px-8 py-2 text-xl font-medium text-green-300">Commit</button>
              <button className="rounded-full border border-red-400 bg-red-900/60 px-8 py-2 text-xl font-medium text-red-300">Report</button>
            </div>
          </Panel>
        </div>
      </div>
      <MapSlot id="emergency-hospital-map" label="Hospitals & ambulance route" className="flex-1" />
    </div>
  )
}
