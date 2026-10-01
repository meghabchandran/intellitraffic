import { Bell, UserCircle, ChevronDown } from 'lucide-react'
import { LiveBadge, WeatherDate } from './Chips.jsx'

export default function TopBar({ title, live = true, user = true }) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between bg-surface px-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-8">
        {live && <LiveBadge />}
        <WeatherDate />
        {user && (
          <>
            <button className="relative" aria-label="Notifications">
              <Bell size={26} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-black">1</span>
            </button>
            <button className="flex items-center gap-1" aria-label="Account">
              <UserCircle size={40} /><ChevronDown size={18} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
