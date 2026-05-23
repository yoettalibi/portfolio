import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'
import { PAGE_SIZE, type Subscription, avatarCls, exportCsv, pageRange } from './subscribers.utils'
import ChevronRightIcon from '../../shared/icons/ChevronRightIcon'
import ComposeNewsletterDialog from './ComposeNewsletterDialog'

export default function SubscribersPage() {
  const { t } = useTranslation()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [composing, setComposing] = useState<Subscription | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  useEffect(() => {
    api.get<Subscription[]>('/subscriptions')
      .then(({ data }) => setSubs(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    setConfirmId(null)
    try {
      await api.delete(`/subscriptions/${id}`)
      setSubs((prev) => {
        const next = prev.filter((s) => s.id !== id)
        const maxPage = Math.max(1, Math.ceil(next.length / PAGE_SIZE))
        if (page > maxPage) setPage(maxPage)
        return next
      })
    } catch {/* ignore */}
  }

  const totalPages = Math.max(1, Math.ceil(subs.length / PAGE_SIZE))
  const pageSubs = subs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const from = subs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, subs.length)

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#7ea8ff] mb-2">
            {t('dashboard.subscribers.eyebrow')}
          </p>
          <h1 className="text-3xl font-bold text-white/90">
            {t('dashboard.subscribers.heading')}{' '}
            <span className="text-white/30">{t('dashboard.subscribers.headingFade')}</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">{t('dashboard.subscribers.body')}</p>
        </div>
        {!loading && subs.length > 0 && (
          <button onClick={() => exportCsv(subs)}
            className="shrink-0 mt-1 rounded-xl border border-white/10 text-slate-400 text-xs font-medium px-4 py-2 hover:border-white/20 hover:text-white transition-all cursor-pointer">
            {t('dashboard.subscribers.export')}
          </button>
        )}
      </div>

      {/* Count */}
      {!loading && subs.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-slate-500 border border-white/8 rounded-full px-3 py-1">
            {subs.length} {t('dashboard.subscribers.count')}
          </span>
        </div>
      )}

      {/* States */}
      {loading ? (
        <div className="flex justify-center py-20"><SpinnerIcon /></div>
      ) : error ? (
        <p className="text-red-400 text-sm">{t('dashboard.subscribers.loadError')}</p>
      ) : subs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-white/50 font-semibold">{t('dashboard.subscribers.emptyTitle')}</p>
          <p className="text-slate-500 text-sm text-center max-w-xs">{t('dashboard.subscribers.emptyBody')}</p>
        </div>
      ) : (
        <>
          {/* List */}
          <div className="rounded-2xl border border-white/8 divide-y divide-white/4 overflow-hidden">
            {pageSubs.map((sub) => (
              <div key={sub.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">

                {/* Avatar */}
                <div className={['w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0', avatarCls(sub.email)].join(' ')}>
                  {sub.email[0].toUpperCase()}
                </div>

                {/* Email + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{sub.email}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {sub.ip_address && (
                      <span className="text-[11px] text-slate-600 font-mono hidden sm:inline">{sub.ip_address}</span>
                    )}
                    <span className="text-[11px] text-slate-600">
                      {new Date(sub.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {confirmId !== sub.id && (
                  <button
                    type="button"
                    onClick={() => setComposing(sub)}
                    title={t('dashboard.subscribers.sendEmail')}
                    className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-[#7ea8ff] hover:border-[#7ea8ff]/30 hover:bg-[#7ea8ff]/5 transition-all cursor-pointer"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 shrink-0">
                      <path d="M17.5 2.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 2.5L12 17.5l-3.5-6L2 8l15.5-5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="hidden sm:inline">{t('dashboard.subscribers.sendEmail')}</span>
                  </button>
                  )}
                  {confirmId === sub.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id)}
                        className="h-8 px-2.5 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer"
                      >
                        {t('dashboard.subscribers.confirmDelete')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                      >
                        {t('dashboard.subscribers.cancelDelete')}
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmId(sub.id)}
                      title={t('dashboard.subscribers.remove')}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/8 transition-all cursor-pointer text-base leading-none">×</button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <span className="text-xs text-slate-600">
                {from}–{to} {t('dashboard.subscribers.of')} {subs.length}
              </span>
              <div className="flex items-center gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {pageRange(page, totalPages).map((p, i) =>
                  p === '…' ? (
                    <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-slate-600 text-xs">…</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p as number)}
                      className={['w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all cursor-pointer',
                        p === page ? 'bg-[#7ea8ff] text-[#07090c] font-bold' : 'text-slate-400 hover:text-white hover:bg-white/8'].join(' ')}>
                      {p}
                    </button>
                  )
                )}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    {composing && (
      <ComposeNewsletterDialog sub={composing} onClose={() => setComposing(null)} />
    )}
    </div>
  )
}

