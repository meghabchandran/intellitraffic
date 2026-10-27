import { useEffect, useRef, useState } from 'react'

const center = { lat: 9.9816, lng: 76.2999 }

export default function GoogleMapSlot({
  id,
  label = 'Google Map',
  className = '',
  children,
}) {
  const node = useRef(null)
  const [message, setMessage] = useState('Loading Google Map…')

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!key) {
      setMessage(
        'Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env to enable Google Maps.'
      )
      return
    }

    let cancelled = false

    const init = () => {
      if (cancelled || !node.current || !window.google?.maps) return

      const map = new window.google.maps.Map(node.current, {
        center,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
      })

      new window.google.maps.Marker({
        map,
        position: center,
        title: 'Demo traffic monitoring location',
      })

      new window.google.maps.Marker({
        map,
        position: { lat: 9.992, lng: 76.305 },
        title: 'Demo hospital',
      })

      new window.google.maps.Polyline({
        map,
        path: [
          center,
          { lat: 9.979, lng: 76.303 },
          { lat: 9.992, lng: 76.305 },
        ],
        strokeColor: '#16a34a',
        strokeWeight: 5,
      })

      setMessage('')
    }

    if (window.google?.maps) {
      init()
      return () => {
        cancelled = true
      }
    }

    const existing = document.querySelector(
      'script[data-google-maps="intellitraffic"]'
    )

    if (existing) {
      window.initIntelliTrafficMap = init
      existing.addEventListener('load', init)
      existing.addEventListener('error', () =>
        setMessage('Google Maps failed to load. Check your API key and billing.')
      )
    } else {
      const script = document.createElement('script')
      script.dataset.googleMaps = 'intellitraffic'
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initIntelliTrafficMap`
      script.async = true
      script.defer = true

      window.initIntelliTrafficMap = init

      script.onerror = () =>
        setMessage('Google Maps failed to load. Check your API key and billing.')

      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      data-map={id}
      aria-label={label}
      className={`relative min-h-[220px] overflow-hidden bg-slate-900 ${className}`}
    >
      <div ref={node} className="absolute inset-0 h-full w-full" />

      {message && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/95 p-6 text-center text-sm text-white/80">
          {message}
        </div>
      )}

      {children}
    </section>
  )
}