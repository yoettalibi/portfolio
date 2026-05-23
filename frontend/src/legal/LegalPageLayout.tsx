import { useTranslation } from 'react-i18next'
import BackLink from '../shared/BackLink'

interface LegalSection {
  title: string
  body: string
  list?: string[]
  footer?: string
}

interface Props {
  namespace: 'privacy' | 'terms' | 'cookies'
}

export function LegalPageLayout({ namespace }: Props) {
  const { t } = useTranslation()
  const ns = `legal.${namespace}`
  const sections = t(`${ns}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <main className="page-container py-24 lg:py-32 max-w-3xl">
      <BackLink label="Back to home" />

      <div className="mb-12">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-4">{t('legal.label')}</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white/90 mb-6">{t(`${ns}.title`)}</h1>
        <p className="text-slate-400 leading-relaxed">{t(`${ns}.intro`)}</p>
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.title} className="border-t border-white/5 pt-8">
            <h2 className="text-lg font-semibold text-white/90 mb-3">{s.title}</h2>
            <p className="text-slate-400 leading-relaxed mb-3">{s.body}</p>
            {s.list && (
              <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-1 mb-3 pl-1">
                {s.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {s.footer && <p className="text-slate-400 leading-relaxed">{s.footer}</p>}
          </section>
        ))}

        <section className="border-t border-white/5 pt-8">
          <h2 className="text-lg font-semibold text-white/90 mb-3">{t(`${ns}.contactHeading`)}</h2>
          <p className="text-slate-400 leading-relaxed mb-4">{t('legal.contact.body')}</p>
          <address className="not-italic text-slate-400 leading-loose">
            <strong className="text-white/80">ET-TALIBI</strong><br />
            <a href="mailto:contact@ettalibi.com" className="text-accent hover:underline">
              {t('legal.contact.email')}
            </a>
          </address>
        </section>
      </div>
    </main>
  )
}
