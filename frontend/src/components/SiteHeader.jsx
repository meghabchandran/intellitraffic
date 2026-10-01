import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { WeatherDate } from './Chips.jsx'

// Header for Home + Login pages
export default function SiteHeader({ showLogo = true, showLogin = false }) {
  return (
    <header className="flex h-20 items-center justify-between bg-surface px-10">
      {showLogo ? <Logo /> : <div />}
      <nav className="flex items-center gap-8">
        <WeatherDate />
        {!showLogin && <Link to="/" className="font-medium">Home</Link>}
        <a href="#contact" className="font-medium">Contact</a>
        {showLogin && <Link to="/" className="rounded-lg bg-white/10 px-6 py-2 font-medium">Login</Link>}
      </nav>
    </header>
  )
}
