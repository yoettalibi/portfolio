import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { btnPrimary } from '../shared/constants'

export default function AboutSection() {
  const { t } = useTranslation()

  return (
    <section id="about" data-fade="" className="page-container py-12 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-center">
        <div className="h-[260px] sm:h-[360px] lg:h-[520px] rounded-4xl border border-white/8 relative overflow-hidden bg-panel-glow-strong">
          <img
            src="/image.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45" />
        </div>
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-2">{t('aboutSection.label')}</p>
          <h2 className="text-[clamp(26px,4.5vw,60px)] leading-[1.1] mb-5 lg:mb-6 font-bold">
            {t('aboutSection.heading')}
          </h2>
          <p className="text-slate-400 leading-[1.8] text-sm md:text-base mb-8 lg:mb-10 max-w-[720px]">
            {t('aboutSection.body')}
          </p>
          <Link to="/about" className={btnPrimary}>
            {t('aboutSection.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
