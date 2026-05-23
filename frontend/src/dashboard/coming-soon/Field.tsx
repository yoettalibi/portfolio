import { useId } from 'react'

const cls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#7ea8ff]/50 transition-colors resize-none [color-scheme:dark]'

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
  type?: string
  rows?: number
}

export function Field({ label, value, onChange, textarea, placeholder, type = 'text', rows = 3 }: FieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-xs text-slate-500 font-medium block mb-1.5">{label}</label>
      {textarea ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  )
}
