import { useTranslation } from 'react-i18next'
import { btnPrimary } from './constants'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section id="contact" data-fade="" className="page-container py-12 lg:py-28 text-center">
      <div className="py-14 px-8 lg:py-20 lg:px-16 rounded-5xl border border-white/8 bg-panel-glow">
        <h2 className="text-[clamp(28px,5vw,68px)] leading-[1.05] mb-5 lg:mb-6 font-bold">
          {t('cta.heading')}
        </h2>
        <p className="text-slate-400 max-w-[720px] mx-auto leading-[1.8] text-sm md:text-base lg:text-lg mb-8 lg:mb-10">
          {t('cta.body')}
        </p>
        <button type="button" className={btnPrimary}>
          {t('cta.button')}
        </button>
      </div>
    </section>
  )
}
