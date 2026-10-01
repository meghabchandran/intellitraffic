import { CloudSun, Calendar } from 'lucide-react'
import useClock from '../hooks/useClock.js'

export function LiveBadge() {
  return (
    <span className="flex items-center gap-2 text-lg">
      <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Live
    </span>
  )
}

// Weather + date/time. temp should come from the weather API later.
export function WeatherDate({ temp = 28 }) {
  const { date, time } = useClock()
  return (
    <>
      <span className="flex items-center gap-2"><CloudSun size={28} /> {temp}°C</span>
      <span className="flex items-center gap-2">
        <Calendar size={28} />
        <span className="text-sm leading-tight"><div>{date}</div><div className="text-white/70">{time}</div></span>
      </span>
    </>
  )
}
