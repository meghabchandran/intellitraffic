import { NavLink, useNavigate } from 'react-router-dom'
import { Settings, LogOut } from 'lucide-react'
import Logo from './Logo.jsx'

const linkCls = ({ isActive }) =>
  `flex items-center gap-4 rounded-xl px-5 py-4 text-xl font-medium transition ${isActive ? 'bg-accent' : 'hover:bg-white/10'}`

export default function Sidebar({ items = [], basePath }) {
  const navigate = useNavigate()
  const logout = () => {
    // TODO: clear auth token
    navigate('/')
  }
  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between bg-surface/80 p-4">
      <div>
        <Logo className="mb-10 px-2" />
        <nav className="flex flex-col gap-3">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={`${basePath}/${to}`} end className={linkCls}>
              <Icon size={26} /> {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <nav className="flex flex-col gap-3">
        <NavLink to={`${basePath}/settings`} className={linkCls}><Settings size={26} /> Settings</NavLink>
        <button onClick={logout} className="flex items-center gap-4 rounded-xl px-5 py-4 text-xl font-medium hover:bg-white/10">
          <LogOut size={26} /> Logout
        </button>
      </nav>
    </aside>
  )
}
