import { Car, Gauge, BarChart3, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import MapSlot from '../components/MapSlot.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, stats, trend } from '../data/mock.js'

const icons = { flow: Car, speed: Gauge, congestion: BarChart3, delay: Clock }

export default function OfficerDashboard() {
  return (
    <div className="flex h-full">
      <div className="flex w-[48%] shrink-0 flex-col">
        <MapSlot id="officer-traffic-map" label="Live traffic map" className="flex-1" />
        <MapSlot id="officer-tracking-map" label="Live tracking (3D / route)" live className="flex-1" />
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-8 text-gray-900">
        <div className="flex gap-6">
          <Panel title="Alerts" light className="flex-1">
            {alerts.map((a) => <AlertCard key={a.id} alert={a} theme="light" />)}
          </Panel>
          <div className="hidden flex-1 rounded-2xl border border-gray-200 bg-white 2xl:block">
            {/* spare slot: AI recommendations later */}
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold">Live Insights</h2>
            <span className="flex items-center gap-2 text-sm text-gray-500">Updated 1 min ago <span className="h-2 w-2 rounded-full bg-green-500" /></span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            {stats.map((s) => {
              const Icon = icons[s.key]
              return (
                <div key={s.key} className="flex items-center gap-4 rounded-xl bg-purple-50 p-4">
                  <div className="rounded-lg bg-white p-3 text-brand"><Icon size={28} /></div>
                  <div>
                    <div className="text-sm text-gray-600">{s.label}</div>
                    <div className={`text-3xl font-semibold ${s.key === 'congestion' ? 'text-orange-500' : 'text-brand'}`}>
                      {s.value} <span className="text-sm font-normal text-gray-500">{s.unit}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="px-6 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Traffic Trend</h3>
              <select className="rounded-lg border border-gray-300 px-3 py-1 text-sm">
                <option>Last 1 Hour</option><option>Last 6 Hours</option><option>Last 24 Hours</option>
              </select>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <AreaChart data={trend}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                  <Area type="linear" dataKey="v" stroke="#6a1b9a" fill="#6a1b9a22" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
