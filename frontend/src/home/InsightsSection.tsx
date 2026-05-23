import { useTranslation } from 'react-i18next'
import { notes } from './insightsSection.data'

const iconCls =
  'absolute bottom-3 right-3 w-28 h-28 text-accent opacity-[0.07] transition-all duration-500 ease-out group-hover:opacity-[0.16] group-hover:scale-110 group-hover:-translate-y-2 pointer-events-none select-none'

const insightIcons = [
  /* 0 Architecture — lightning / performance */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>,
  /* 1 Systems Thinking — network nodes */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>,
  /* 2 Engineering Philosophy — compass */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>,
]

export default function InsightsSection() {
  const { t } = useTranslation()

  return (
    <section id="insights" data-fade="" className="page-container py-12 lg:py-28">
      <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-2">
        {t('insights.label')}
      </p>
      <h2 className="text-[clamp(28px,5vw,68px)] leading-[1.05] mb-6 lg:mb-14 max-w-[760px] font-bold">
        {t('insights.heading')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(({ cat, title, desc }, i) => (
          <article
            key={title}
            className="relative overflow-hidden group p-6 lg:p-8 rounded-4xl bg-white/3 border border-white/6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/18 hover:shadow-[0_0_40px_rgba(126,168,255,0.05)]"
          >
            {insightIcons[i]}
            <span className="relative z-10 text-slate-400 text-sm inline-block mb-3">{t(cat)}</span>
            <h3 className="relative z-10 text-xl font-semibold leading-[1.4] mb-3">{t(title)}</h3>
            <p className="relative z-10 text-slate-400 text-sm leading-[1.8]">{t(desc)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
