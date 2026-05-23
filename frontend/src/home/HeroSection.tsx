import { useTranslation } from 'react-i18next'
import CountUp from './CountUp'
import { btnPrimary } from '../shared/constants'
import { stats, tags, scrollToSection } from './heroSection.data'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="page-container pt-10 pb-12 lg:pt-24 lg:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-20">

        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2.5 py-2.5 px-4 rounded-full border border-white/8 bg-white/3 text-slate-400 text-sm mb-5">
            {t('hero.badge')}
          </div>

          <h1 className="text-[clamp(30px,5.2vw,68px)] leading-[1.05] font-extrabold mb-5 lg:mb-6 max-w-[760px]">
            {t('hero.heading')}{' '}
            <span className="text-white/55">{t('hero.headingFade')}</span>
          </h1>

          <p className="max-w-[640px] text-slate-400 text-base md:text-lg leading-[1.8] mb-8 lg:mb-10">
            {t('hero.body')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={() => scrollToSection('work')} className={`${btnPrimary} sm:w-auto w-full`}>
              {t('hero.cta1')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('systems')}
              className="sm:w-auto w-full py-4.5 px-7 rounded-2xl text-base text-white transition-all duration-300 border border-white/8 bg-white/3 hover:-translate-y-1 cursor-pointer bg-transparent"
            >
              {t('hero.cta2')}
            </button>
          </div>
        </div>

        {/* Right — dashboard panel */}
        <div className="hidden lg:block relative rounded-4xl border border-white/8 overflow-hidden bg-panel-subtle">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-hero-glow" />

          <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/6">
            <span className="text-sm font-semibold tracking-wide">{t('hero.dashboardTitle')}</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
              {t('hero.dashboardStatus')}
            </span>
          </div>

          <div className="relative px-6 pt-6 pb-5">
            <div className="text-xs text-slate-400 uppercase tracking-[0.18em] mb-2">{t('hero.dashboardPerfLabel')}</div>
            <div className="text-[56px] font-extrabold leading-none mb-2">
              <CountUp target={99.98} duration={2000} />
            </div>
            <div className="text-sm text-slate-400 leading-[1.6]">{t('hero.dashboardPerfSub')}</div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 px-6 pb-5">
            {stats.map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-white/4 border border-white/6 px-4 py-3.5">
                <div className="text-xs text-slate-400 mb-1">{t(label)}</div>
                <div className="text-sm font-semibold">{t(value)}</div>
              </div>
            ))}
          </div>

          <div className="relative flex gap-2 flex-wrap px-6 pt-4 pb-6 border-t border-white/5">
            {tags.map((tag) => (
              <span key={tag} className="py-1.5 px-3 rounded-full bg-white/4 border border-white/6 text-xs text-slate-400">
                {t(tag)}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
