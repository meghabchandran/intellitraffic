
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

const DEFAULT_CENTER = [9.9816, 76.2999]

const roads = [
  {
    id: 'road-1',
    name: 'Sample Road A',
    congestion: 'low',
    positions: [
      [9.9816, 76.2999],
      [9.986, 76.31],
      [9.99, 76.32],
    ],
  },
  {
    id: 'road-2',
    name: 'Sample Road B',
    congestion: 'high',
    positions: [
      [9.968, 76.285],
      [9.975, 76.295],
      [9.9816, 76.2999],
    ],
  },
  {
    id: 'road-3',
    name: 'Sample Road C',
    congestion: 'moderate',
    positions: [
      [9.986, 76.31],
      [9.995, 76.316],
      [10.002, 76.325],
    ],
  },
]

const incidents = [
  {
    id: 'INC-001',
    type: 'Accident',
    status: 'Reported',
    position: [9.975, 76.295],
  },
  {
    id: 'INC-002',
    type: 'Road closure',
    status: 'Under review',
    position: [9.995, 76.316],
  },
]

const hospitals = [
  {
    id: 'H-01',
    name: 'Demo General Hospital',
    position: [9.992, 76.305],
    capability: 'Emergency / trauma (demo)',
    color: '#2563eb',
    status: 'Available (demo)',
  },
  {
    id: 'H-02',
    name: 'Demo Medical Centre',
    position: [9.97, 76.312],
    capability: 'Emergency care (demo)',
    color: '#dc2626',
    status: 'Limited availability (demo)',
  },
  {
    id: 'H-03',
    name: 'Demo City Hospital',
    position: [9.986, 76.282],
    capability: 'Emergency care (demo)',
    color: '#2563eb',
    status: 'Available (demo)',
  },
]

const ambulances = [
  {
    id: 'AMB-01',
    name: 'Ambulance 01',
    position: [9.986, 76.31],
    status: 'Available (demo)',
  },
  {
    id: 'AMB-02',
    name: 'Ambulance 02',
    position: [9.977, 76.301],
    status: 'En route (demo)',
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

function createHospitalIcon(color) {
  return L.divIcon({
    className: 'hospital-map-icon',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        font-size: 17px;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
      ">H</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function MapResize() {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150)
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
  center = DEFAULT_CENTER,
  showHospitals = false,
  showAmbulances = false,
  showRoutes = false,
}) {
  const actualRoute = [
    [9.9816, 76.2999],
    [9.979, 76.303],
    [9.984, 76.307],
    [9.992, 76.305],
  ]

  const predictedRoute = [
    [9.9816, 76.2999],
    [9.977, 76.294],
    [9.982, 76.287],
    [9.986, 76.282],
  ]

  return (
    <section
      data-map={id}
      aria-label={label}
      className={`relative isolate min-h-0 overflow-hidden bg-[#0b0912] ${className}`}
    >
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResize />

        {zoom && <ZoomControl position="bottomright" />}

        {roads.map((road) => (
          <Polyline
            key={road.id}
            positions={road.positions}
            pathOptions={{
              color: roadColors[road.congestion],
              weight: 5,
              opacity: 0.8,
            }}
          >
            <Popup>
              <strong>{road.name}</strong>
              <br />
              Congestion: {road.congestion}
              <br />
              <em>Illustrative overlay, not live traffic data.</em>
            </Popup>
          </Polyline>
        ))}

        {incidents.map((item) => (
          <CircleMarker
            key={item.id}
            center={item.position}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor:
                item.type === 'Accident' ? '#dc2626' : '#a855f7',
              fillOpacity: 1,
            }}
          >
            <Tooltip>{item.type}</Tooltip>
            <Popup>
              <strong>{item.type}</strong>
              <br />
              ID: {item.id}
              <br />
              Status: {item.status}
            </Popup>
          </CircleMarker>
        ))}

        {(showAmbulances || !showHospitals) &&
          ambulances.map((ambulance) => (
            <Marker
              key={ambulance.id}
              position={ambulance.position}
              icon={ambulanceIcon}
            >
              <Popup>
                <strong>{ambulance.name}</strong>
                <br />
                {ambulance.status}
                <br />
                <em>Connect GPS/API for real tracking.</em>
              </Popup>
            </Marker>
          ))}

        {showHospitals &&
          hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={hospital.position}
              icon={createHospitalIcon(hospital.color)}
            >
              <Tooltip>{hospital.name}</Tooltip>
              <Popup>
                <strong>{hospital.name}</strong>
                <br />
                {hospital.capability}
                <br />
                Status: {hospital.status}
                <br />
                <em>
                  Demonstration data only; verify hospital details
                  before real-world use.
                </em>
              </Popup>
            </Marker>
          ))}

        {showRoutes && (
          <>
            <Polyline
              positions={actualRoute}
              pathOptions={{
                color: '#22c55e',
                weight: 6,
              }}
            >
              <Popup>
                <strong>Current route (demo)</strong>
                <br />
                Estimated 12 min · 4.2 km
              </Popup>
            </Polyline>

            <Polyline
              positions={predictedRoute}
              pathOptions={{
                color: '#a855f7',
                weight: 6,
                dashArray: '8 8',
              }}
            >
              <Popup>
                <strong>Predicted alternative (demo)</strong>
                <br />
                Predicted 10 min · 4.8 km
              </Popup>
            </Polyline>
          </>
        )}
      </MapContainer>

      {live && (
        <span className="pointer-events-none absolute left-5 top-4 z-[1000] flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-sm text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Demo data
        </span>
      )}

      {children}
    </section>
  )
}
