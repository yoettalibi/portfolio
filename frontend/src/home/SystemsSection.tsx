import { useTranslation } from 'react-i18next'
import { items } from './systemsSection.data'

const iconCls =
  'absolute bottom-3 right-3 w-32 h-32 text-accent opacity-[0.07] transition-all duration-500 ease-out group-hover:opacity-[0.16] group-hover:scale-110 group-hover:-translate-y-2 pointer-events-none select-none'

const systemIcons = [
  /* 0 Systems Architecture — layers */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>,
  /* 1 SaaS Engineering — cloud */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>,
  /* 2 Mobile Applications — smartphone */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>,
  /* 3 Automation Systems — cog */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>,
  /* 4 Frontend Systems — monitor */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  /* 5 Backend Infrastructure — server */
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>,
]

export default function SystemsSection() {
  const { t } = useTranslation()

  return (
    <section id="systems" data-fade="" className="page-container py-12 lg:py-28">
      <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-2">
        {t('systems.label')}
      </p>
      <h2 className="text-[clamp(28px,5vw,68px)] leading-[1.05] mb-6 lg:mb-14 font-bold">
        {t('systems.heading')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ title, desc }, i) => (
          <div
            key={title}
            className="relative overflow-hidden group p-6 lg:p-8 rounded-4xl bg-white/3 border border-white/6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/18 hover:shadow-[0_0_40px_rgba(126,168,255,0.05)]"
          >
            {systemIcons[i]}
            <h3 className="relative z-10 text-xl font-semibold mb-3 leading-[1.35]">{t(title)}</h3>
            <p className="relative z-10 text-slate-400 text-base leading-[1.8]">{t(desc)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
