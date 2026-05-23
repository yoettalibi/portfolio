export const PAGE_SIZE = 10

export interface Subscription {
  id: number
  email: string
  ip_address: string | null
  created_at: string
}

const PALETTE = [
  'bg-[#7ea8ff]/15 text-[#7ea8ff]',
  'bg-emerald-400/15 text-emerald-400',
  'bg-violet-400/15 text-violet-400',
  'bg-amber-400/15 text-amber-400',
  'bg-pink-400/15 text-pink-400',
  'bg-cyan-400/15 text-cyan-400',
  'bg-rose-400/15 text-rose-400',
  'bg-teal-400/15 text-teal-400',
]

export function avatarCls(email: string): string {
  let h = 0
  for (const c of email) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return PALETTE[h % PALETTE.length]
}

export function exportCsv(subs: Subscription[]): void {
  const rows = subs.map((s) => `${s.email},${s.ip_address ?? ''},${s.created_at}`)
  const csv = ['Email,IP Address,Subscribed At', ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'subscribers.csv'; a.click()
  URL.revokeObjectURL(url)
}

export function pageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
