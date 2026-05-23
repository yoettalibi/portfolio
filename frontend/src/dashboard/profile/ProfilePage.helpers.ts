export const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/40 transition-colors'

export const inputErrCls =
  'w-full rounded-xl border border-red-500/50 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-red-500/60 transition-colors'

/** ≥8 chars, at least one letter AND at least one digit */
export function isStrongPassword(p: string): boolean {
  return p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p)
}

export function extractError(
  err: unknown,
  primaryField: string,
  fallback: string,
): string {
  const resp = (
    err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
  ).response
  if (resp?.data?.errors?.[primaryField]) return resp.data.errors[primaryField][0]
  if (resp?.data?.message) return resp.data.message
  return fallback
}
