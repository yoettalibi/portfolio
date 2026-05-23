import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'cookie_consent'

type Consent = 'accepted' | 'declined'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Consent | null
    if (!saved) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-[fadeSlideUp_0.3s_ease_both]"
    >
      <div className="rounded-2xl border border-white/8 bg-[#0d1117] p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-white/90">{t('legal.cookieBanner.title')}</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('legal.cookieBanner.body')}{' '}
            <Link to="/cookies" className="text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent whitespace-nowrap">
              {t('legal.cookieBanner.learnMore')}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={accept}
            className="flex-1 rounded-lg bg-accent text-[#07090c] text-xs font-semibold py-2 px-4 hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            {t('legal.cookieBanner.accept')}
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-lg border border-white/10 text-slate-400 text-xs font-medium py-2 px-4 hover:border-white/20 hover:text-white/70 transition-all duration-200 cursor-pointer"
          >
            {t('legal.cookieBanner.decline')}
          </button>
        </div>
      </div>
    </div>
  )
}
