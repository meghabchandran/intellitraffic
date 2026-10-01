import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, MapPin, Cross } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/TopBar.jsx'

const NAV = {
  officer: [
    { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: 'ev-tracking', label: 'EV Tracking', icon: MapPin },
  ],
  emergency: [
    { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: 'hospitals', label: 'Hospitals', icon: Cross },
  ],
  public: [],
}

export default function DashboardLayout({ role }) {
  const { pathname } = useLocation()
  const title = pathname.endsWith('settings') ? 'Settings' : 'Dashboard'
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={NAV[role]} basePath={`/${role}`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} user={role !== 'public'} live={role !== 'emergency' || title === 'Settings'} />
        <main className="min-h-0 flex-1"><Outlet /></main>
      </div>
    </div>
  )
}
