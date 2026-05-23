import { useTranslation } from 'react-i18next'
import ProjectCard from './ProjectCard'
import { IllustrationDashboard, IllustrationSaaS } from './Illustrations'
import { principles } from './principlesWorkSection.data'
import { workProjectSlugs } from '../data/workProjects'

const illustrations = [<IllustrationDashboard />, <IllustrationSaaS />]

export default function PrinciplesWorkSection() {
  const { t } = useTranslation()

  return (
    <div data-fade="" className="page-container pt-4 pb-12 lg:pb-28">
      <div className="rounded-4xl border border-white/8 overflow-hidden">

        {/* Principles grid */}
        <div className="px-7 lg:px-10 py-10 lg:py-14 border-b border-white/6">
          <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-8">
            {t('principles.label')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/6 rounded-3xl overflow-hidden">
            {principles.map(({ title, desc }, i) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-7 lg:p-8 bg-canvas hover:bg-white/3 transition-colors duration-300"
              >
                <span className="text-xs font-semibold text-accent tracking-widest">
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-base font-semibold text-white leading-snug">{t(title)}</h2>
                <p className="text-slate-400 text-sm leading-[1.75]">{t(desc)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Work */}
        <section id="work" className="px-7 lg:px-10 py-12 lg:py-16">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-8 lg:mb-12">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
                {t('principles.workLabel')}
              </p>
              <h2 className="text-[clamp(28px,4vw,58px)] leading-[1.05] font-bold max-w-[680px]">
                {t('principles.workHeading')}
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {workProjectSlugs.map((slug, i) => (
              <ProjectCard
                key={slug}
                index={i}
                category={t(`projects.${slug}.category`)}
                title={t(`projects.${slug}.title`)}
                description={t(`projects.${slug}.description`)}
                tags={t(`projects.${slug}.tags`, { returnObjects: true }) as string[]}
                slug={slug}
                cta={t(`projects.${slug}.cta`)}
                illustration={illustrations[i]}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
