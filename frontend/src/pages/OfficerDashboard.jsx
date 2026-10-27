import { Car, Gauge, BarChart3, Clock } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import TrafficMap from '../components/maps/TrafficMap.jsx'
import DatasetWorkbench from '../components/DatasetWorkbench.jsx'
import Panel from '../components/Panel.jsx'
import AlertCard from '../components/AlertCard.jsx'
import { alerts, stats, trend } from '../data/mock.js'

const icons = {
  flow: Car,
  speed: Gauge,
  congestion: BarChart3,
  delay: Clock,
}

export default function OfficerDashboard() {
  return (
    <div className="flex h-full min-h-0">
      <div className="flex w-[48%] min-w-0 shrink-0 flex-col">
        <TrafficMap
          id="officer-traffic-map"
          label="Live traffic map"
          className="min-h-[300px] flex-1"
        />

        <TrafficMap
          id="officer-tracking-map"
          label="Live tracking and route"
          live
          className="min-h-[300px] flex-1"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-6 overflow-y-auto bg-gray-50 p-8 text-gray-900">
        <div className="flex gap-6">
          <Panel title="Alerts" light className="flex-1">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                theme="light"
              />
            ))}
          </Panel>

          <div className="hidden flex-1 rounded-2xl border border-gray-200 bg-white 2xl:block">
            <div className="p-5">
              <h2 className="text-lg font-semibold">
                Traffic recommendations
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Upload a traffic dataset below to generate
                data-driven insights.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold">Live Insights</h2>

            <span className="flex items-center gap-2 text-sm text-gray-500">
              Demo statistics
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6">
            {stats.map((stat) => {
              const Icon = icons[stat.key]

              return (
                <div
                  key={stat.key}
                  className="flex items-center gap-4 rounded-xl bg-purple-50 p-4"
                >
                  <div className="rounded-lg bg-white p-3 text-brand">
                    {Icon && <Icon size={28} />}
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>

                    <div
                      className={`text-3xl font-semibold ${
                        stat.key === 'congestion'
                          ? 'text-orange-500'
                          : 'text-brand'
                      }`}
                    >
                      {stat.value}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        {stat.unit}
                      </span>
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
                <option>Last 1 Hour</option>
                <option>Last 6 Hours</option>
                <option>Last 24 Hours</option>
              </select>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid vertical={false} stroke="#eee" />

                  <XAxis dataKey="t" tick={{ fontSize: 12 }} />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />

                  <Area
                    type="linear"
                    dataKey="v"
                    stroke="#6a1b9a"
                    fill="#6a1b9a22"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <DatasetWorkbench />
      </div>
    </div>
  )
}