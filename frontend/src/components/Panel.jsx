import { ArrowRight } from 'lucide-react'

// Card with a title + "View all" link
export default function Panel({ title, viewAll = true, light = false, className = '', children }) {
  return (
    <div className={`rounded-2xl border ${light ? 'border-gray-200 bg-white text-gray-900' : 'border-white/20 bg-surface text-white'} ${className}`}>
      <div className={`flex items-center justify-between border-b px-5 py-4 ${light ? 'border-gray-200' : 'border-white/20'}`}>
        <h2 className="text-xl font-semibold">{title}</h2>
        {viewAll && (
          <button className={`flex items-center gap-1 text-sm ${light ? 'text-brand' : ''}`}>View all <ArrowRight size={14} /></button>
        )}
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </div>
  )
}
