import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { GA4_PATTERN, sanitizeGa4Input } from './DashboardPage.helpers'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [ga4Id, setGa4Id]       = useState('')
  const [savedId, setSavedId]   = useState('')   // what is actually stored in DB
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    api.get<{ ga4_id: string | null }>('/settings').then(({ data }) => {
      const v = data.ga4_id ?? ''
      setGa4Id(v)
      setSavedId(v)
    }).catch(() => {/* non-critical */})
  }, [])

  const isValid    = GA4_PATTERN.test(ga4Id)
  const isChanged  = ga4Id !== savedId
  const hasSaved   = GA4_PATTERN.test(savedId)
  const canSave    = isValid && isChanged

  async function handleSave() {
    setError(null)
    setSaved(false)
    setSaving(true)
    try {
      await api.patch('/settings', { ga4_id: ga4Id })
      setSavedId(ga4Id)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError(t('dashboard.analytics.saveError'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setError(null)
    setSaved(false)
    setDeleting(true)
    try {
      await api.patch('/settings', { ga4_id: null })
      setGa4Id('')
      setSavedId('')
    } catch {
      setError(t('dashboard.analytics.deleteError'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div className="mb-8">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">{t('dashboard.analytics.eyebrow')}</p>
        <h1 className="text-[clamp(26px,3.5vw,48px)] leading-[1.1] font-extrabold mb-4">
          {t('dashboard.analytics.heading')} <span className="text-white/30">{t('dashboard.analytics.headingFade')}</span>
        </h1>
        <p className="text-slate-400 text-base leading-[1.8]">
          {t('dashboard.analytics.body')}
        </p>
      </div>

      <section className="rounded-2xl border border-white/8 bg-white/3 p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                d="M21.8 10.2H12v3.6h5.6c-.5 2.5-2.7 4.2-5.6 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 3.9 1.5l2.6-2.6C16.9 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.4 0 9.1-3.8 9.1-9.1 0-.6-.1-1.2-.2-1.8z"
                fill="#4285F4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{t('dashboard.analytics.cardTitle')}</h2>
            <p className="text-[11px] text-slate-500">{t('dashboard.analytics.cardSub')}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-5">
          {t('dashboard.analytics.desc')}
        </p>

        {/* Input */}
        <input
          id="ga4-id"
          name="ga4_id"
          aria-label="Google Analytics 4 ID"
          type="text"
          placeholder="G-XXXXXXXXXX"
          value={ga4Id}
          onChange={(e) => {
            setGa4Id(sanitizeGa4Input(e.target.value))
            setError(null)
            setSaved(false)
          }}
          className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/40 transition-colors font-mono tracking-wider"
          spellCheck={false}
          autoComplete="off"
          maxLength={22}
        />

        {/* Buttons row — always below the input */}
        <div className="flex items-center gap-2 mt-3">
          {/* Delete — only visible when something is saved in DB */}
          <button
            onClick={() => void handleDelete()}
            disabled={deleting || saving}
            className={[
              'px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-2',
              hasSaved
                ? 'border-red-500/30 text-red-400 hover:border-red-500/60 hover:text-red-300 opacity-100 pointer-events-auto'
                : 'border-transparent text-transparent opacity-0 pointer-events-none',
              (deleting || saving) ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {deleting && <SpinnerIcon />}
            {deleting ? t('dashboard.analytics.deleting') : t('dashboard.analytics.delete')}
          </button>

          <div className="flex-1" />

          {/* Save — only active when valid and changed */}
          <button
            onClick={() => void handleSave()}
            disabled={saving || deleting}
            className={[
              'px-5 py-2 rounded-xl bg-accent text-bg text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-2',
              canSave
                ? 'opacity-100 scale-100 pointer-events-auto hover:opacity-90'
                : 'opacity-0 scale-95 pointer-events-none',
              saving ? 'opacity-50' : '',
            ].join(' ')}
          >
            {saving && <SpinnerIcon />}
            {saving ? t('dashboard.analytics.saving') : t('dashboard.analytics.save')}
          </button>
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        {saved && <p className="mt-3 text-xs text-emerald-400">{t('dashboard.analytics.saveSuccess')}</p>}
        {!hasSaved && !error && !saved && (
          <p className="mt-3 text-[11px] text-slate-600">{t('dashboard.analytics.noId')}</p>
        )}
      </section>
    </div>
  )
}
