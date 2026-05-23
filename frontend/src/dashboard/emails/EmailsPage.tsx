import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'

interface ResendEmail {
  id: string
  subject: string | null
  from: string
  reply_to: string | null
  created_at: string
  last_event: string | null
  has_reply: boolean
}

/** Parse `"Name" <email>` or `Name <email>` or bare email */
function parseAddress(raw: string | null): { name: string; email: string } | null {
  if (!raw) return null
  const match = raw.match(/^"?([^"<]+?)"?\s*<([^>]+)>$/)
  if (match) return { name: match[1].trim(), email: match[2].trim() }
  return { name: raw, email: raw }
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}

const DOT: Record<string, string> = {
  delivered:  'bg-emerald-400',
  opened:     'bg-blue-400',
  clicked:    'bg-indigo-400',
  sent:       'bg-slate-500',
  queued:     'bg-yellow-400',
  scheduled:  'bg-yellow-400',
  bounced:    'bg-red-400',
  complained: 'bg-red-400',
  failed:     'bg-red-400',
}

const TEXT: Record<string, string> = {
  delivered:  'text-emerald-400',
  opened:     'text-blue-400',
  clicked:    'text-indigo-400',
  sent:       'text-slate-400',
  queued:     'text-yellow-400',
  scheduled:  'text-yellow-400',
  bounced:    'text-red-400',
  complained: 'text-red-400',
  failed:     'text-red-400',
}

interface EmailReplyItem {
  id: number
  body: string
  created_at: string
}

interface EmailDetail {
  id: string
  subject: string | null
  from: string
  reply_to: string | null
  created_at: string
  last_event: string | null
  text: string | null
  replies: EmailReplyItem[]
}

const PAGE_SIZE = 10

export default function EmailsPage() {
  const { t } = useTranslation()
  const [emails, setEmails]     = useState<ResendEmail[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [page, setPage]         = useState(1)
  const [detail, setDetail]     = useState<EmailDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showReply, setShowReply]         = useState(false)
  const [replyText, setReplyText]         = useState('')
  const [replySending, setReplySending]   = useState(false)
  const [replyError, setReplyError]       = useState<string | null>(null)
  const [deletingId, setDeletingId]       = useState<string | null>(null)
  const [blockConfirm, setBlockConfirm]   = useState(false)
  const [blockError, setBlockError]       = useState<string | null>(null)

  useEffect(() => {
    api.get<{ data: ResendEmail[] }>('/emails')
      .then(({ data }) => setEmails(data.data))
      .catch(() => setError(t('dashboard.emails.loadError')))
      .finally(() => setLoading(false))
  }, [t])

  function openEmail(id: string) {
    setDetail(null)
    setDetailLoading(true)
    setShowReply(false)
    setReplyText('')
    setReplyError(null)
    setBlockConfirm(false)
    setBlockError(null)
    api.get<EmailDetail>(`/emails/${id}`)
      .then(({ data }) => setDetail(data))
      .finally(() => setDetailLoading(false))
  }

  function closeDetail() {
    setDetail(null)
    setDetailLoading(false)
    setShowReply(false)
    setReplyText('')
    setReplyError(null)
    setBlockConfirm(false)
    setBlockError(null)
  }

  function confirmDelete(id: string) {
    api.delete(`/emails/${id}`)
      .then(() => {
        setEmails(es => es.filter(e => e.id !== id))
        setDeletingId(null)
        if (detail?.id === id) closeDetail()
      })
      .catch(() => setDeletingId(null))
  }

  function confirmBlock() {
    if (!detail) return
    const senderEmail = parseAddress(detail.reply_to)?.email
    if (!senderEmail) return
    api.post('/emails/block', { email: senderEmail })
      .then(() => {
        setEmails(es => es.filter(e => e.id !== detail.id))
        closeDetail()
      })
      .catch(() => setBlockError(t('dashboard.emails.blockError')))
  }

  function sendReply() {
    if (!detail || !replyText.trim()) return
    setReplySending(true)
    setReplyError(null)
    api.post<{ ok: boolean; reply: EmailReplyItem }>(`/emails/${detail.id}/reply`, { body: replyText.trim() })
      .then(({ data }) => {
        setDetail(d => d ? { ...d, replies: [...d.replies, data.reply] } : d)
        setEmails(es => es.map(e => e.id === detail.id ? { ...e, has_reply: true } : e))
        setReplyText('')
        setShowReply(false)
      })
      .catch(() => setReplyError(t('dashboard.emails.replyError')))
      .finally(() => setReplySending(false))
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div className="mb-2">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
          {t('dashboard.emails.eyebrow')}
        </p>
        <h1 className="text-[clamp(26px,3.5vw,48px)] leading-[1.1] font-extrabold mb-4">
          {t('dashboard.emails.heading')}{' '}
          <span className="text-white/30">{t('dashboard.emails.headingFade')}</span>
        </h1>
        <p className="text-slate-400 text-base leading-[1.8]">
          {t('dashboard.emails.body')}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-16 text-slate-500">
          <SpinnerIcon />
          <span className="text-sm">{t('dashboard.emails.loading')}</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && emails.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/2 px-8 py-24 flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center">
              <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-slate-700"/>
                <path d="M1 6l10.5 7.4a2.5 2.5 0 0 0 3 0L25 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-slate-700"/>
              </svg>
            </div>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-[#0d0d0f]" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[15px] font-semibold text-white/50">{t('dashboard.emails.emptyTitle')}</p>
            <p className="text-sm text-slate-600 max-w-[280px] leading-[1.8]">{t('dashboard.emails.emptySubtitle')}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && emails.length > 0 && (() => {
        const totalPages = Math.ceil(emails.length / PAGE_SIZE)
        const paginated  = emails.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        return (
        <div className="rounded-2xl border border-white/8 overflow-hidden">

          {/* Meta bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/2">
            <span className="text-xs text-slate-500">
              {emails.length} {t('dashboard.emails.messages')}
            </span>
            {totalPages > 1 && (
              <span className="text-xs text-slate-600">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, emails.length)}
              </span>
            )}
          </div>

          {/* Column headers — desktop */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_150px_120px] border-b border-white/6 bg-white/3 px-5 py-2.5 gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{t('dashboard.emails.colSender')}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{t('dashboard.emails.colSubject')}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{t('dashboard.emails.colDate')}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{t('dashboard.emails.colStatus')}</span>
          </div>

          {/* Scrollable rows */}
          <div className="overflow-y-auto max-h-[560px]">
            {paginated.map((email, i) => {
              const event   = email.last_event ?? 'sent'
              const sender  = parseAddress(email.reply_to)
              const abbr    = sender ? initials(sender.name) : '?'
              const dotCls  = DOT[event]  ?? DOT['sent']
              const textCls = TEXT[event] ?? TEXT['sent']

              if (deletingId === email.id) {
                return (
                  <div
                    key={email.id}
                    className={[
                      'flex items-center justify-between px-5 py-4 gap-4 bg-red-950/20',
                      i > 0 ? 'border-t border-red-500/10' : '',
                    ].join(' ')}
                  >
                    <span className="text-xs text-slate-300">{t('dashboard.emails.deleteConfirm')}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {t('dashboard.emails.replyCancel')}
                      </button>
                      <button
                        onClick={() => confirmDelete(email.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                      >
                        {t('dashboard.emails.deleteBtn')}
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={email.id}
                  onClick={() => openEmail(email.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && openEmail(email.id)}
                  className={[
                    'relative group w-full text-left flex flex-col md:grid md:grid-cols-[1fr_1fr_150px_120px] md:items-center',
                    'gap-3 md:gap-4 px-5 py-4 transition-colors duration-150 hover:bg-white/3 cursor-pointer',
                    i > 0 ? 'border-t border-white/5' : '',
                  ].join(' ')}
                >
                  {/* Sender */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/15 flex items-center justify-center text-[11px] font-bold text-accent select-none">
                        {abbr}
                      </div>
                      {email.has_reply && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent flex items-center justify-center" title="Replied">
                          <svg width="8" height="7" viewBox="0 0 8 7" fill="none" aria-hidden="true">
                            <path d="M3.5 1L1 3.5l2.5 2.5M1 3.5h4a2 2 0 0 1 2 2" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 leading-snug">
                      <span className="text-sm font-semibold text-white truncate">
                        {sender?.name ?? '—'}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {sender?.email ?? email.reply_to ?? '—'}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <span className="text-sm text-slate-300 truncate min-w-0">
                    {email.subject ?? t('dashboard.emails.noSubject')}
                  </span>

                  {/* Date */}
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDate(email.created_at)}
                  </span>

                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} />
                      <span className={`text-xs font-medium capitalize ${textCls}`}>{event}</span>
                    </div>
                    {email.has_reply && (
                      <span className="text-[10px] font-medium text-accent/70">
                        ↩ {t('dashboard.emails.replied')}
                      </span>
                    )}
                  </div>

                  {/* Delete button — visible on hover */}
                  <button
                    onClick={e => { e.stopPropagation(); setDeletingId(email.id) }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={t('dashboard.emails.deleteBtn')}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1.5 3.5h11M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M2.5 3.5l.7 7.7a1 1 0 0 0 1 .8h5.6a1 1 0 0 0 1-.8l.7-7.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/6 bg-white/2">
              <span className="text-xs text-slate-500">
                {t('dashboard.emails.page')} {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/8 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← {t('dashboard.emails.prev')}
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/8 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {t('dashboard.emails.next')} →
                </button>
              </div>
            </div>
          )}
        </div>
        )
      })()}

      {/* ── Email detail modal ─────────────────────────────────── */}
      {(detailLoading || detail) && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={closeDetail}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0d0d12] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
              <span className="text-sm font-semibold text-white truncate pr-4">
                {detail?.subject ?? t('dashboard.emails.noSubject')}
              </span>
              <button
                onClick={closeDetail}
                className="shrink-0 w-8 h-8 rounded-xl bg-white/6 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Loading state */}
            {detailLoading && !detail && (
              <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
                <SpinnerIcon />
                <span className="text-sm">{t('dashboard.emails.loading')}</span>
              </div>
            )}

            {/* Content */}
            {detail && (() => {
              const event   = detail.last_event ?? 'sent'
              const sender  = parseAddress(detail.reply_to)
              const abbr    = sender ? initials(sender.name) : '?'
              const dotCls  = DOT[event]  ?? DOT['sent']
              const textCls = TEXT[event] ?? TEXT['sent']
              const history = detail.replies
              return (
                <>
                  {/* Sender meta */}
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 shrink-0">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/15 flex items-center justify-center text-sm font-bold text-accent select-none">
                      {abbr}
                    </div>
                    <div className="flex flex-col min-w-0 leading-snug flex-1">
                      <span className="text-sm font-semibold text-white">{sender?.name ?? '—'}</span>
                      <span className="text-[11px] text-slate-500">{sender?.email ?? detail.reply_to ?? '—'}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">{formatDate(detail.created_at)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                        <span className={`text-[10px] font-medium capitalize ${textCls}`}>{event}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable body: original message + reply history */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5 min-h-0">
                    {/* Original message */}
                    <pre className="text-sm text-slate-300 leading-[1.8] whitespace-pre-wrap font-[inherit]">
                      {detail.text ?? t('dashboard.emails.noBody')}
                    </pre>

                    {/* Reply history */}
                    {history.length > 0 && (
                      <div className="flex flex-col gap-3 pt-1">
                        <div className="border-t border-white/6" />
                        {history.map((reply, i) => (
                          <div key={i} className="flex justify-end">
                            <div className="max-w-[88%] bg-accent/8 border border-accent/20 rounded-2xl rounded-tr-sm px-4 py-3">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                                  {t('dashboard.emails.replyYou')}
                                </span>
                                <span className="text-[10px] text-slate-600">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-sm text-slate-300 leading-[1.7] whitespace-pre-wrap">{reply.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply textarea (shown when reply is open) */}
                  {showReply && (
                    <div className="shrink-0 border-t border-white/6 px-6 py-4 flex flex-col gap-3 bg-white/2">
                      <textarea
                        id="reply-message"
                        name="reply"
                        aria-label={t('dashboard.emails.replyPlaceholder')}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={t('dashboard.emails.replyPlaceholder')}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/40 leading-[1.7]"
                        autoFocus
                      />
                      {replyError && (
                        <p className="text-xs text-red-400">{replyError}</p>
                      )}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setShowReply(false); setReplyText(''); setReplyError(null) }}
                          className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          {t('dashboard.emails.replyCancel')}
                        </button>
                        <button
                          onClick={sendReply}
                          disabled={!replyText.trim() || replySending}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-sm font-semibold text-black disabled:opacity-40 hover:opacity-90 transition-opacity"
                        >
                          {replySending && <SpinnerIcon className="w-4 h-4" />}
                          {replySending ? t('dashboard.emails.replySending') : t('dashboard.emails.replySend')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Footer: Reply + Block buttons */}
                  {!showReply && (
                    <div className="shrink-0 border-t border-white/6 px-6 py-4 flex items-center justify-between gap-4">
                      <button
                        onClick={() => setShowReply(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-accent/30 bg-accent/8 text-sm font-semibold text-accent hover:bg-accent/15 transition-colors"
                      >
                        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden="true">
                          <path d="M6 1L1 6l5 5M1 6h8a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {t('dashboard.emails.reply')}
                      </button>

                      <div className="flex items-center gap-2">
                        {blockConfirm ? (
                          <>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">{t('dashboard.emails.blockConfirm')}</span>
                            <button
                              onClick={() => { setBlockConfirm(false); setBlockError(null) }}
                              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              {t('dashboard.emails.replyCancel')}
                            </button>
                            <button
                              onClick={confirmBlock}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                            >
                              {t('dashboard.emails.blockBtn')}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setBlockConfirm(true)}
                            className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                              <path d="M2.5 2.5l7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            {t('dashboard.emails.blockSender')}
                          </button>
                        )}
                        {blockError && <span className="text-[11px] text-red-400">{blockError}</span>}
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
