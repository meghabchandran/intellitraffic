import { useEffect, useState } from 'react'

export default function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}
