import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { isValidSlug } from '../data/workProjects'
import CTASection from '../shared/CTASection'
import BackLink from '../shared/BackLink'

export default function WorkProjectPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()

  if (!slug || !isValidSlug(slug)) return <Navigate to="/" replace />

  const title = t(`projects.${slug}.title`)
  const description = t(`projects.${slug}.description`)
  const category = t(`projects.${slug}.category`)
  const outcome = t(`projects.${slug}.outcome`)
  const tags = t(`projects.${slug}.tags`, { returnObjects: true }) as string[]
  const steps = t(`projects.${slug}.steps`, { returnObjects: true }) as Array<{ title: string; desc: string }>

  useSeo({
    title: `${title} — ET-TALIBI`,
    description,
    canonical: `https://ettalibi.com/work/${slug}`,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `https://ettalibi.com/work/${slug}#webpage`,
          url: `https://ettalibi.com/work/${slug}`,
          name: `${title} — ET-TALIBI`,
          description,
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          inLanguage: 'en',
          breadcrumb: { '@id': `https://ettalibi.com/work/${slug}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `https://ettalibi.com/work/${slug}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: title },
          ],
        },
        {
          '@type': 'CreativeWork',
          '@id': `https://ettalibi.com/work/${slug}#work`,
          url: `https://ettalibi.com/work/${slug}`,
          name: title,
          description,
          author:    { '@id': 'https://ettalibi.com/#person' },
          creator:   { '@id': 'https://ettalibi.com/#person' },
          publisher: { '@id': 'https://ettalibi.com/#person' },
        },
      ],
    },
  })

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.setAttribute('data-visible', '')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-fade]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="page-container py-20 lg:py-28">

      {/* Back */}
      <BackLink label={t('workProject.back')} />

      {/* Header */}
      <div className="mb-16 lg:mb-20">
        <span className="text-accent text-xs uppercase tracking-[0.2em] mb-4 block">
          {category}
        </span>
        <h1 className="text-[clamp(28px,4vw,56px)] font-bold leading-[1.1] mb-6 max-w-[720px]">
          {title}
        </h1>
        <p className="text-slate-400 text-base lg:text-lg leading-[1.8] max-w-[620px] mb-8">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="py-2 px-3.5 rounded-full bg-white/4 border border-white/6 text-xs text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Process Map */}
      <div className="mb-16 lg:mb-20">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-12">
          {t('workProject.processLabel')}
        </p>

        <div className="relative">
          <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-accent/20 via-white/6 to-transparent hidden sm:block" />
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-6 sm:gap-10">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border border-white/10 bg-canvas flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className={`flex flex-col ${i < steps.length - 1 ? 'pb-10' : 'pb-0'} flex-1`}>
                  <div className="rounded-2xl border border-white/6 bg-white/2 p-6 hover:border-accent/20 hover:bg-white/4 transition-all duration-300">
                    <h3 className="text-base font-semibold text-white mb-2 leading-snug">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-[1.8]">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome */}
      <div className="rounded-3xl border border-accent/20 bg-accent/4 p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <p className="uppercase tracking-[0.2em] text-xs text-accent">{t('workProject.outcomeLabel')}</p>
        </div>
        <p className="text-base lg:text-lg text-white/80 leading-[1.85] max-w-[680px]">
          {outcome}
        </p>
      </div>

      {/* CTA */}
      <CTASection />

    </section>
  )
}
