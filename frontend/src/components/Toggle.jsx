export default function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative h-9 w-16 rounded-full transition ${checked ? 'bg-purple-800' : 'bg-white/20'}`}
    >
      <span className={`absolute top-1 h-7 w-7 rounded-full bg-gray-200 transition-all ${checked ? 'left-8' : 'left-1'}`} />
    </button>
  )
}
