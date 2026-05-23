import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import { useScrollContainer } from './ScrollContext'
import { scrollLinks, useNavAction } from '../hooks/useNavAction'
import { useClickOutside } from '../hooks/useClickOutside'
import { useAuth } from '../auth/AuthContext'

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
] as const

const linkCls = (active = false) =>
  `relative text-sm transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 group ${
    active ? 'text-white' : 'text-slate-400 hover:text-white'
  }`

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { goToSection, navigate, pathname } = useNavAction()
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    document.documentElement.lang = code
    setLangOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  useClickOutside(langRef, langOpen, () => setLangOpen(false))

  const scrollEl = useScrollContainer()

  useEffect(() => {
    if (!scrollEl) return
    setScrolled(scrollEl.scrollTop > 20)
    const onScroll = () => setScrolled(scrollEl.scrollTop > 20)
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollEl.removeEventListener('scroll', onScroll)
  }, [scrollEl])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isContact = pathname === '/contact'
  const isAbout   = pathname === '/about'
  const isHome    = pathname === '/'

  return (
    <nav
      aria-label={t('nav.ariaMain')}
      className={`sticky top-0 z-[100] transition-all duration-300 border-b backdrop-blur-md ${
        scrolled
          ? 'border-white/7 bg-canvas/88 shadow-nav'
          : 'border-white/4 bg-canvas/72'
      }`}
    >
      <div className="page-container h-16 md:h-[84px] flex items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center gap-1 rounded-full border border-white/6 bg-white/3 px-2 py-1.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`${linkCls(isHome)} px-3.5 py-1.5 rounded-full transition-colors duration-200 ${isHome ? 'bg-white/8' : 'hover:bg-white/5'}`}
            >
              {t('nav.home')}
              {isHome && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
            </button>

            {scrollLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goToSection(link.id)}
                className={`${linkCls(false)} px-3.5 py-1.5 rounded-full hover:bg-white/5 transition-colors duration-200`}
              >
                {t(link.key)}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-accent transition-[width] duration-300 group-hover:w-4" />
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigate('/about')}
              className={`${linkCls(isAbout)} px-3.5 py-1.5 rounded-full transition-colors duration-200 ${isAbout ? 'bg-white/8' : 'hover:bg-white/5'}`}
            >
              {t('nav.about')}
              {isAbout && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
            </button>

            <button
              type="button"
              onClick={() => navigate('/contact')}
              className={`${linkCls(isContact)} px-3.5 py-1.5 rounded-full transition-colors duration-200 ${isContact ? 'bg-white/8' : 'hover:bg-white/5'}`}
            >
              {t('nav.contact')}
              {isContact && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="hidden sm:inline-flex items-center gap-2 py-2.5 px-5 md:py-3 md:px-6 rounded-full border border-accent/22 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-accent-glow bg-gradient-to-br from-accent/12 to-white/4 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
            {t('nav.cta')}
          </button>

          {/* Dashboard shortcut — visible only when logged in */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full border border-accent/30 bg-accent/8 text-xs font-semibold text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t('nav.dashboard')}
            </button>
          )}

          {/* Language switcher */}
          <div ref={langRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 py-2 px-3 rounded-full border border-white/8 bg-white/3 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/6 transition-all duration-200 cursor-pointer"
            >
              {i18n.language.toUpperCase().slice(0, 2)}
              <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-24 rounded-2xl border border-white/8 bg-canvas/95 backdrop-blur-md shadow-nav overflow-hidden z-50">
                {langs.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 cursor-pointer ${
                      i18n.language === lang.code
                        ? 'text-white bg-white/8'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label={t('nav.ariaToggle')}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full border border-white/8 bg-white/3 cursor-pointer"
          >
            <span className={`w-4 h-px bg-white/70 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`w-4 h-px bg-white/70 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-px bg-white/70 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="page-container pb-5 pt-3 flex flex-col gap-3">

          {/* Links — same pill style as desktop */}
          <div className="flex flex-col gap-0.5 rounded-2xl border border-white/6 bg-white/3 p-2">
            {([
              { label: t('nav.home'),    action: () => navigate('/'),        active: isHome    },
              ...scrollLinks.map((link) => ({ label: t(link.key), action: () => goToSection(link.id), active: false })),
              { label: t('nav.about'),   action: () => navigate('/about'),   active: isAbout   },
              { label: t('nav.contact'), action: () => navigate('/contact'), active: isContact },
            ] as { label: string; action: () => void; active: boolean }[]).map(({ label, action, active }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className={`relative text-left text-sm py-2.5 px-3.5 rounded-xl transition-colors duration-200 cursor-pointer bg-transparent ${
                  active ? 'bg-white/8 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-accent/22 text-sm font-medium bg-gradient-to-br from-accent/12 to-white/4 cursor-pointer text-white transition-all duration-300 hover:border-accent/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
            {t('nav.cta')}
          </button>

          {/* Dashboard shortcut — mobile, visible only when logged in */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-accent/30 bg-accent/8 text-sm font-semibold text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t('nav.dashboard')}
            </button>
          )}

          {/* Language switcher */}
          <div className="flex items-center gap-2">
            {langs.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer ${
                  i18n.language === lang.code
                    ? 'border-accent/30 bg-accent/10 text-white'
                    : 'border-white/8 bg-white/3 text-slate-400 hover:text-white hover:bg-white/6'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}
