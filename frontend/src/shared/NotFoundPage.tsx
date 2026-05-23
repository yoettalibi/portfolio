import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'

export default function NotFoundPage() {
  const { t } = useTranslation()

  useSeo({
    title: `404 — ${t('notFound.title')}`,
    noIndex: true,
  })

  return (
    <main className="page-container flex flex-col items-center justify-center min-h-[70vh] py-24 text-center">
      <p
        className="text-[9rem] sm:text-[12rem] font-black leading-none select-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, rgba(126,168,255,0.25) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="text-2xl sm:text-3xl font-bold text-white/90 mt-2 mb-4">
        {t('notFound.title')}
      </h1>

      <p className="text-slate-400 max-w-sm leading-relaxed mb-10">
        {t('notFound.body')}
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-accent text-[#07090c] text-sm font-semibold px-6 py-3 hover:brightness-110 transition-all duration-200"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('notFound.cta')}
      </Link>
    </main>
  )
}
