import { Link } from 'react-router-dom'
import { CarFront, Ambulance, Car } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'

const roles = [
  { label: 'Officer', to: '/login/officer', icon: CarFront },
  { label: 'Emergency', to: '/login/emergency', icon: Ambulance },
  { label: 'Public', to: '/public', icon: Car },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* To add your tunnel photo: put it in /public/hero.jpg and uncomment the style line */}
      <main
        className="relative flex flex-1 items-center justify-between gap-10 bg-gradient-to-br from-bg via-[#2a1a3d] to-[#4a2a5e] px-12 py-10"
        // style={{ backgroundImage: "linear-gradient(rgba(18,15,26,.7),rgba(18,15,26,.7)), url('/hero.jpg')", backgroundSize: 'cover' }}
      >
        <div className="max-w-3xl">
          <h2 className="font-serif text-5xl italic leading-tight">
            Making every journey smarter.<br />Making every emergency faster.
          </h2>
          <p className="mt-16 max-w-2xl text-lg italic text-white/80">
            IntelliTraffic AI is an AI-powered traffic intelligence platform designed to understand, predict, and respond to changing road conditions. Our focus is on emergency mobility, helping ambulances and traffic authorities make faster, data-driven decisions when every minute matters.
          </p>
        </div>

        <div className="w-[34rem] shrink-0 rounded-[3rem] bg-white/15 p-10 backdrop-blur">
          <div className="rounded-full bg-black/30 py-4 text-center font-serif text-3xl tracking-widest">Login as</div>
          <ul className="mt-10 space-y-6">
            {roles.map(({ label, to, icon: Icon }) => (
              <li key={label}>
                <Link to={to} className="flex items-center gap-8 rounded-full px-10 py-5 text-2xl font-semibold transition hover:bg-black/30">
                  <Icon size={44} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="px-12 pb-6 text-right font-serif text-3xl italic">Predict. Understand. Respond. Move smarter.</footer>
    </div>
  )
}
