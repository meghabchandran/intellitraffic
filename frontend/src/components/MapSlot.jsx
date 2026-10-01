import { Plus, Minus } from 'lucide-react'

/**
 * Empty slot where the real map goes later.
 * The inner <div id={id}> is the mount point for Leaflet / MapLibre / Mapbox / Google Maps.
 * `children` render as overlays (search box, legend, etc.) above the map.
 */
export default function MapSlot({ id, label = 'Map', className = '', zoom = true, live = false, children }) {
  return (
    <section className={`relative overflow-hidden bg-[#0b0912] ${className}`} data-map={id}>
      <div id={id} className="absolute inset-0 flex items-center justify-center border border-dashed border-white/15">
        <span className="text-sm text-white/30">{label} — map mounts here (#{id})</span>
      </div>
      {live && (
        <span className="absolute left-5 top-4 z-10 flex items-center gap-2 text-lg">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Live
        </span>
      )}
      {zoom && (
        <div className="absolute right-5 top-5 z-10 flex flex-col overflow-hidden rounded-md bg-white text-black shadow">
          <button className="px-3 py-3" aria-label="Zoom in"><Plus size={16} /></button>
          <button className="px-3 py-3" aria-label="Zoom out"><Minus size={16} /></button>
        </div>
      )}
      {children}
    </section>
  )
}
