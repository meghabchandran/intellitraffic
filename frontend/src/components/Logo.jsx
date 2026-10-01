import { TrafficCone } from 'lucide-react'

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TrafficCone size={34} />
      <span className="text-xl font-semibold">IntelliTraffic AI</span>
    </div>
  )
}
