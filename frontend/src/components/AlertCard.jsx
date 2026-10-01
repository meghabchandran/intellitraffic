const dark = { high: 'text-red-400', medium: 'text-orange-400', low: 'text-yellow-400' }
const light = {
  high: 'bg-red-50 text-red-500', medium: 'bg-orange-50 text-orange-500', low: 'bg-yellow-50 text-yellow-500',
}

export default function AlertCard({ alert, theme = 'dark' }) {
  const box = theme === 'dark' ? 'bg-white/20' : light[alert.level]
  const title = theme === 'dark' ? dark[alert.level] : ''
  const sub = theme === 'dark' ? 'text-white' : 'text-gray-900'
  return (
    <div className={`rounded-2xl p-4 ${box}`}>
      <div className="flex items-start justify-between">
        <span className={`flex items-center gap-2 font-medium ${title}`}>
          <span className="h-2 w-2 rounded-full bg-current" /> {alert.type}
        </span>
        <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>{alert.ago}</span>
      </div>
      <p className={`mt-3 pl-4 text-sm ${sub}`}>{alert.place}</p>
    </div>
  )
}
