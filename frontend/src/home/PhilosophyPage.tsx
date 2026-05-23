import { useTranslation } from 'react-i18next'
import PhilosophySection from './PhilosophySection'

export default function PhilosophyPage() {
  const { t } = useTranslation()

  return (
    <section data-fade="" className="relative w-full py-12 lg:py-28 overflow-hidden">
      {/* background layer */}
      <div className="absolute inset-0 bg-[#0d1117]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,#7ea8ff0d,transparent)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-white/[0.06]" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/[0.06]" />

      <div className="page-container text-center min-h-screen lg:min-h-0 flex flex-col justify-center lg:block relative">
        <h2 className="uppercase tracking-[0.2em] text-xs font-medium text-slate-400 mb-3">
          {t('philosophy.label')}
        </h2>
        <PhilosophySection />
      </div>
    </section>
  )
}
