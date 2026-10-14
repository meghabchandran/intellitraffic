
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  ZoomControl,
  Marker,
  Tooltip,
  useMap,
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

// Demonstration data only.
// Replace these coordinates with real road geometry later.
const roads = [
  {
    id: 'road-1',
    name: 'Sample Road A',
    congestion: 'low',
    positions: [
      [9.9816, 76.2999],
      [9.9860, 76.3100],
      [9.9900, 76.3200],
    ],
  },
  {
    id: 'road-2',
    name: 'Sample Road B',
    congestion: 'high',
    positions: [
      [9.9680, 76.2850],
      [9.9750, 76.2950],
      [9.9816, 76.2999],
    ],
  },
  {
    id: 'road-3',
    name: 'Sample Road C',
    congestion: 'moderate',
    positions: [
      [9.9860, 76.3100],
      [9.9950, 76.3160],
      [10.0020, 76.3250],
    ],
  },
]

const incidents = [
  {
    id: 'INC-001',
    type: 'Accident',
    status: 'Reported',
    position: [9.9750, 76.2950],
  },
  {
    id: 'INC-002',
    type: 'Road closure',
    status: 'Under review',
    position: [9.9950, 76.3160],
  },
]

const ambulances = [
  {
    id: 'AMB-01',
    name: 'Ambulance 01',
    position: [9.9860, 76.3100],
  },
]

const roadColors = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#ef4444',
  closed: '#a855f7',
}

const ambulanceIcon = L.divIcon({
  className: 'ambulance-map-icon',
  html: '<span style="font-size:25px">🚑</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

function MapResize() {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(timer)
  }, [map])

  return null
}

export default function TrafficMap({
  id,
  label = 'Traffic map',
  className = '',
  zoom = true,
  live = false,
  children,
}) {
  return (
    <section
      data-map={id}
      aria-label={label}
      className={`relative isolate min-h-0 overflow-hidden bg-[#0b0912] ${className}`}
    >
      <MapContainer
        center={[9.9816, 76.2999]}
        zoom={13}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResize />

        {zoom && <ZoomControl position="bottomright" />}

        {/* Colour-coded road overlays */}
        {roads.map((road) => (
          <Polyline
            key={road.id}
            positions={road.positions}
            pathOptions={{
              color: roadColors[road.congestion],
              weight: 6,
              opacity: 0.9,
            }}
          >
            <Popup>
              <strong>{road.name}</strong>
              <br />
              Congestion: {road.congestion}
            </Popup>
          </Polyline>
        ))}

        {/* Incident markers */}
        {incidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={incident.position}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor:
                incident.type === 'Accident'
                  ? '#dc2626'
                  : '#a855f7',
              fillOpacity: 1,
            }}
          >
            <Tooltip>{incident.type}</Tooltip>
            <Popup>
              <strong>{incident.type}</strong>
              <br />
              ID: {incident.id}
              <br />
              Status: {incident.status}
            </Popup>
          </CircleMarker>
        ))}

        {/* Demonstration ambulance marker */}
        {ambulances.map((ambulance) => (
          <Marker
            key={ambulance.id}
            position={ambulance.position}
            icon={ambulanceIcon}
          >
            <Popup>
              <strong>{ambulance.name}</strong>
              <br />
              Demonstration location
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Keep your existing dashboard overlays above the map */}
      {live && (
        <span className="pointer-events-none absolute left-5 top-4 z-[1000] flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Demo map
        </span>
      )}

      {children}
    </section>
  )
}
