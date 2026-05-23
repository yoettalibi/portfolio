import { useState, useEffect } from 'react'
import { MONTHS, WEEKDAYS } from './comingSoon.utils'
import ChevronRightIcon from '../../shared/icons/ChevronRightIcon'

interface DateTimePickerProps {
  value: string
  onChange: (v: string) => void
  label: string
}

function pad(n: number) { return n.toString().padStart(2, '0') }

export function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const parsed = value ? new Date(value) : null
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
      setHour(d.getHours())
      setMinute(d.getMinutes())
    }
  }, [value])

  const now = new Date()
  const selY = value ? parseInt(value.slice(0, 4)) : -1
  const selMo = value ? parseInt(value.slice(5, 7)) - 1 : -1
  const selD = value ? parseInt(value.slice(8, 10)) : -1
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()
  const isSelectedToday = selY === now.getFullYear() && selMo === now.getMonth() && selD === now.getDate()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  function selectDay(day: number) {
    let h = hour, m = minute
    const clickedToday = viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate()
    if (clickedToday && (h < now.getHours() || (h === now.getHours() && m < now.getMinutes()))) {
      h = now.getHours(); m = now.getMinutes()
      setHour(h); setMinute(m)
    }
    onChange(`${viewYear}-${pad(viewMonth + 1)}-${pad(day)}T${pad(h)}:${pad(m)}`)
  }

  function applyTime(h: number, m: number) {
    if (isSelectedToday && (h < now.getHours() || (h === now.getHours() && m < now.getMinutes()))) {
      h = now.getHours(); m = now.getMinutes()
    }
    setHour(h); setMinute(m)
    if (value) onChange(`${value.slice(0, 10)}T${pad(h)}:${pad(m)}`)
  }

  const display = parsed
    ? `${MONTHS[parsed.getMonth()].slice(0, 3)} ${parsed.getDate()}, ${parsed.getFullYear()}  ·  ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
    : null

  const spinBtn = (icon: 'up' | 'dn', fn: () => void) => (
    <button type="button" onClick={fn}
      className="w-8 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all">
      <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
        {icon === 'up'
          ? <path d="M5 13l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </button>
  )

  return (
    <div>
      <label className="text-xs text-slate-500 font-medium block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={[
          'w-full text-left rounded-xl border px-4 py-2.5 text-sm outline-none transition-all flex items-center justify-between gap-2 group',
          open ? 'border-[#7ea8ff]/50 bg-[#7ea8ff]/5' : 'border-white/10 bg-white/[0.04] hover:border-white/20',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="none" className={['w-4 h-4 shrink-0 transition-colors', open ? 'text-[#7ea8ff]' : 'text-slate-600 group-hover:text-slate-400'].join(' ')}>
            <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M3 8h14" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className={display ? 'text-white' : 'text-slate-600'}>{display ?? 'Select date & time…'}</span>
        </div>
        {value ? (
          <span role="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false) }}
            className="text-slate-600 hover:text-red-400 transition-colors text-lg leading-none">×</span>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-slate-500">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/80 p-5 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">{label}</span>
              <button type="button" onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all text-lg leading-none">×</button>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <button type="button"
                onClick={() => { if (!isCurrentMonth) { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) } }}
                disabled={isCurrentMonth}
                className={['w-8 h-8 flex items-center justify-center rounded-xl transition-all', isCurrentMonth ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/8'].join(' ')}>
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                  <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="text-sm font-semibold text-white">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button"
                onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all">
                <ChevronRightIcon />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-600 py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const isSel = selY === viewYear && selMo === viewMonth && selD === day
                const isTod = now.getFullYear() === viewYear && now.getMonth() === viewMonth && now.getDate() === day
                const isPast = viewYear < now.getFullYear()
                  || (viewYear === now.getFullYear() && viewMonth < now.getMonth())
                  || (viewYear === now.getFullYear() && viewMonth === now.getMonth() && day < now.getDate())
                return (
                  <button key={day} type="button"
                    onClick={() => !isPast && selectDay(day)}
                    disabled={isPast}
                    className={['aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center',
                      isPast ? 'text-slate-700 cursor-not-allowed'
                      : isSel ? 'bg-[#7ea8ff] text-[#07090c] font-bold shadow-lg shadow-[#7ea8ff]/20'
                      : isTod ? 'ring-1 ring-inset ring-[#7ea8ff]/30 text-[#7ea8ff] hover:bg-[#7ea8ff]/10'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'].join(' ')}
                  >{day}</button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-white/6 my-3" />

            {/* Time selector */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-0.5">
                {spinBtn('up', () => applyTime((hour + 1) % 24, minute))}
                <div className="w-11 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/8 text-white font-bold tabular-nums">
                  {pad(hour)}
                </div>
                {spinBtn('dn', () => applyTime((hour + 23) % 24, minute))}
              </div>
              <span className="text-[#7ea8ff]/50 font-bold text-xl mb-0.5">:</span>
              <div className="flex flex-col items-center gap-0.5">
                {spinBtn('up', () => applyTime(hour, (minute + 5) % 60))}
                <div className="w-11 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/8 text-white font-bold tabular-nums">
                  {pad(minute)}
                </div>
                {spinBtn('dn', () => applyTime(hour, (minute + 55) % 60))}
              </div>
            </div>

            {/* Done */}
            <button type="button" onClick={() => setOpen(false)}
              className="w-full mt-3 rounded-xl bg-[#7ea8ff]/10 border border-[#7ea8ff]/20 text-[#7ea8ff] text-xs font-semibold py-2 hover:bg-[#7ea8ff]/20 transition-all">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
