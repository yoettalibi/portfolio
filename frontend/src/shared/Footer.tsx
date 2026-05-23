import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import { links } from './footer.data'

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms',   to: '/terms' },
  { label: 'Cookies', to: '/cookies' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-white/5 pt-16 pb-14">
      <div className="page-container flex flex-col gap-10">

        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
          <div className="flex items-baseline w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[0, 1].map(r => (
              <Fragment key={r}>
                <span className="whitespace-nowrap text-[clamp(32px,4vw,56px)] font-bold text-white/90 pr-10">
                  {t('footer.tagline1')}
                </span>
                <span className="text-accent/50 text-[clamp(24px,3vw,44px)] pr-10 select-none" aria-hidden="true">—</span>
                <span className="whitespace-nowrap text-[clamp(32px,4vw,56px)] font-bold text-white/90 pr-10">
                  {t('footer.tagline2')}
                </span>
                <span className="text-accent/50 text-[clamp(24px,3vw,44px)] pr-10 select-none" aria-hidden="true">—</span>
                <span className="whitespace-nowrap text-[clamp(32px,4vw,56px)] font-bold text-white/90 pr-10">
                  {t('footer.tagline3')}
                </span>
                <span className="text-accent/50 text-[clamp(24px,3vw,44px)] pr-10 select-none" aria-hidden="true">—</span>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-white/5 pt-7">
          <div className="flex flex-col gap-3">
            <Logo />
            <small className="text-slate-400">{t('footer.subBrand')}</small>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 text-sm self-center sm:self-auto">
            {links.filter(l => !l.href.startsWith('mailto')).map(({ label, href }, i) => (
              <Fragment key={label}>
                {i > 0 && <span className="text-white/20 select-none" aria-hidden="true">·</span>}
                <a href={href} className="inline-flex items-center h-11 px-2 text-slate-400 hover:text-fg transition-colors duration-200">
                  {label}
                </a>
              </Fragment>
            ))}
            <span className="text-white/20 select-none" aria-hidden="true">·</span>
            {legalLinks.map(({ label, to }, i) => (
              <Fragment key={to}>
                {i > 0 && <span className="text-white/20 select-none" aria-hidden="true">·</span>}
                <Link to={to} className="inline-flex items-center h-11 px-2 text-slate-500 hover:text-slate-300 transition-colors duration-200">
                  {label}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
