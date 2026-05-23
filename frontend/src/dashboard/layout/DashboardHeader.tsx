import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import Logo from '../../shared/Logo'
import { useClickOutside } from '../../hooks/useClickOutside'

function formatLoginTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

export default function DashboardHeader() {
  const { t, i18n } = useTranslation()
  const { user, loginTime, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    document.documentElement.lang = code
    setLangOpen(false)
  }

  useClickOutside(langRef, langOpen, () => setLangOpen(false))

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const currentLang = i18n.language?.slice(0, 2).toUpperCase() ?? 'EN'

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/6 bg-bg/80 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Logo />
        <span className="hidden sm:block w-px h-5 bg-white/10" aria-hidden />
        <span className="hidden sm:block text-[11px] font-medium text-accent/60 uppercase tracking-[0.15em]">
          {t('dashboard.header.label')}
        </span>
      </div>

      {/* Admin info + lang switcher + sign out */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Clickable profile info */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="flex flex-col items-end group focus:outline-none"
          aria-label="Go to profile settings"
        >
          <span className="text-sm font-semibold text-white leading-tight group-hover:text-accent transition-colors">
            {user?.name ?? '—'}
          </span>
          {loginTime && (
            <span className="hidden sm:block text-[11px] text-slate-500 leading-tight group-hover:text-slate-400 transition-colors">
              {t('dashboard.header.sessionStarted')} {formatLoginTime(loginTime)}
            </span>
          )}
        </button>

        {/* Language switcher */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-white/8 hover:border-white/20"
            aria-label="Switch language"
          >
            {currentLang}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 min-w-[5rem] rounded-xl border border-white/10 bg-bg/95 backdrop-blur-md shadow-xl overflow-hidden z-50">
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={[
                    'w-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-left transition-colors',
                    i18n.language?.startsWith(lang.code)
                      ? 'text-accent bg-white/6'
                      : 'text-slate-400 hover:text-white hover:bg-white/4',
                  ].join(' ')}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={() => void handleLogout()}
          disabled={loggingOut}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loggingOut ? (
            <svg className="w-3 h-3 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          <span className="hidden sm:inline">
            {loggingOut ? t('dashboard.header.signingOut') : t('dashboard.header.signOut')}
          </span>
        </button>
      </div>
    </header>
  )
}

