import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import CTASection from '../shared/CTASection'
import { useScrollFade } from '../hooks/useScrollFade'
import { statsData, expertiseData, philosophyData } from './aboutPage.data'
import BackLink from '../shared/BackLink'

export default function AboutPage() {
  const { t } = useTranslation()

  useSeo({
    title: t('aboutPage.seo.title'),
    description: t('aboutPage.seo.description'),
    canonical: t('aboutPage.seo.canonical'),
    ogType: 'profile',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': 'https://ettalibi.com/about#webpage',
          url: 'https://ettalibi.com/about',
          name: 'About — ET-TALIBI',
          description: 'ET-TALIBI builds scalable digital systems, operational infrastructure, and secure business platforms engineered for long-term growth and reliability.',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          about: { '@id': 'https://ettalibi.com/#person' },
          inLanguage: 'en',
          breadcrumb: { '@id': 'https://ettalibi.com/about#breadcrumb' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://ettalibi.com/about#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: 'About' },
          ],
        },
        {
          '@type': 'Person',
          '@id': 'https://ettalibi.com/#person',
          name: 'ET-TALIBI',
          url: 'https://ettalibi.com',
          image: 'https://ettalibi.com/image.png',
          jobTitle: 'Full-Stack Software Engineer',
          description: 'ET-TALIBI builds scalable digital systems, operational infrastructure, and secure business platforms engineered for long-term growth and reliability.',
          sameAs: [
            'https://github.com/yoettalibi',
            'https://www.linkedin.com/in/yoettalibi/',
            'https://www.instagram.com/yoettalibi/',
          ],
          knowsAbout: ['SaaS Development', 'Backend Systems', 'Mobile Applications', 'System Architecture', 'Workflow Automation', 'Business Software'],
          knowsLanguage: ['en', 'fr'],
          skills: 'SaaS platforms, Laravel, React, TypeScript, React Native, System Architecture, REST APIs, MySQL, Workflow Automation',
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Full-Stack Software Engineer',
            skills: 'SaaS, Laravel, React, TypeScript, Mobile Development, System Architecture',
          },
        },
      ],
    },
  })

  const statsRef = useRef<HTMLDivElement>(null)
  const countersStarted = useRef(false)

  const expertiseSection = useScrollFade()
  const stackSection = useScrollFade()
  const philosophySection = useScrollFade()

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-visible', '')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('[data-fade]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || countersStarted.current) return
        countersStarted.current = true
        el.querySelectorAll('[data-count]').forEach((node) => {
          const target = Number(node.getAttribute('data-count'))
          const suffix = node.getAttribute('data-suffix') ?? ''
          let current = 0
          const tick = () => {
            current += target / (1400 / 16)
            if (current >= target) {
              node.textContent = target + suffix
            } else {
              node.textContent = Math.floor(current) + suffix
              requestAnimationFrame(tick)
            }
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fadeStyle = (visible: boolean): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(28px)',
    transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
  })

  const tags = t('aboutPage.tags', { returnObjects: true }) as string[]
  const capabilityTags = t('aboutPage.capabilityTags', { returnObjects: true }) as string[]

  return (
    <div className="page-container py-20 lg:py-28">

      {/* BACK */}
      <BackLink label={t('aboutPage.back')} />

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 lg:gap-20 items-start mb-20 lg:mb-28">

        {/* IMAGE */}
        <div className="relative h-[360px] lg:h-[500px] rounded-4xl overflow-hidden border border-white/8 bg-about-hero">
          <div className="absolute inset-0 bg-grid-subtle" />
          <img
            src="/image.png"
            alt={t('aboutPage.portrait')}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-canvas/70 to-transparent" />
        </div>

        {/* BIO */}
        <div className="flex flex-col justify-center pt-0 lg:pt-6">
          <span className="text-accent text-xs uppercase tracking-[0.2em] mb-3 block">
            {t('aboutPage.accentLabel')}
          </span>
          <h1 className="text-[clamp(36px,5.5vw,76px)] font-bold leading-[1.0] mb-3 text-white">
            {t('aboutPage.name')}
          </h1>
          <p className="text-slate-500 text-sm mb-8 tracking-[0.18em] uppercase">
            {t('aboutPage.tagline')}
          </p>
          <div className="w-12 h-px bg-accent/40 mb-8" />
          <p className="text-slate-400 leading-[1.85] text-sm lg:text-base mb-5 max-w-[560px]">
            {t('aboutPage.bio1')}
          </p>
          <p className="text-slate-400 leading-[1.85] text-sm lg:text-base max-w-[560px]">
            {t('aboutPage.bio2')}
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            {tags.map((tag) => (
              <span key={tag} className="py-1.5 px-3 rounded-full bg-accent/8 border border-accent/20 text-xs text-accent/80">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* STATS */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 lg:mb-28">
        {statsData.map(({ value, suffix, label }) => (
          <div key={label} className="rounded-3xl border border-white/7 bg-white/2 p-6 lg:p-8 text-center hover:border-accent/25 hover:bg-white/4 transition-all duration-300">
            <span data-count={value} data-suffix={suffix} className="block text-[clamp(36px,4.5vw,56px)] font-bold text-white leading-none mb-2">
              0{suffix}
            </span>
            <span className="text-slate-500 text-xs tracking-[0.12em] uppercase">
              {t(label)}
            </span>
          </div>
        ))}
      </div>

      {/* EXPERTISE */}
      <div ref={expertiseSection.ref} style={fadeStyle(expertiseSection.visible)} className="mb-20 lg:mb-28">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
          {t('aboutPage.expertiseLabel')}
        </p>
        <h2 className="text-[clamp(24px,3.5vw,46px)] font-bold leading-[1.1] mb-12 max-w-[580px] text-white">
          {t('aboutPage.expertiseHeading')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertiseData.map(({ title, desc }, i) => (
            <div key={title} className="rounded-3xl border border-white/7 bg-white/2 p-6 hover:border-accent/25 hover:bg-white/4 transition-all duration-300">
              <span className="text-xs font-bold text-accent tracking-widest mb-4 block">
                #{String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-semibold text-white mb-2">{t(title)}</h3>
              <p className="text-slate-400 text-sm leading-[1.75]">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAPABILITIES */}
      <div ref={stackSection.ref} style={fadeStyle(stackSection.visible)} className="mb-20 lg:mb-28">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
          {t('aboutPage.capabilitiesLabel')}
        </p>
        <h2 className="text-[clamp(24px,3.5vw,46px)] font-bold leading-[1.1] mb-10 text-white">
          {t('aboutPage.capabilitiesHeading')}
        </h2>
        <div className="flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,5%,black_15%,black_85%,transparent_95%,transparent)]">
          {[
            [...capabilityTags.slice(0, 8), ...capabilityTags.slice(0, 8)],
            [...capabilityTags.slice(7), ...capabilityTags.slice(7)],
          ].map((row, ri) => (
            <div
              key={ri}
              className={`flex gap-3 w-max hover:[animation-play-state:paused] ${
                ri === 0
                  ? 'animate-[marquee_28s_linear_infinite]'
                  : 'animate-[marquee-reverse_24s_linear_infinite]'
              }`}
            >
              {row.map((item, ii) => (
                <span key={ii} className="whitespace-nowrap py-2.5 px-5 rounded-full border border-white/8 bg-white/3 text-sm text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PHILOSOPHY */}
      <div ref={philosophySection.ref} style={fadeStyle(philosophySection.visible)} className="mb-20 lg:mb-28">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
          {t('aboutPage.philosophyLabel')}
        </p>
        <h2 className="text-[clamp(24px,3.5vw,46px)] font-bold leading-[1.1] mb-12 max-w-[540px] text-white">
          {t('aboutPage.philosophyHeading')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {philosophyData.map(({ number, title, desc }) => (
            <div key={number} className="rounded-3xl border border-white/7 bg-white/2 p-7 hover:border-accent/20 transition-all duration-300">
              <span className="text-4xl font-extrabold text-white/5 block mb-5 leading-none select-none">
                {number}
              </span>
              <h3 className="text-base font-semibold text-white mb-3">{t(title)}</h3>
              <p className="text-slate-400 text-sm leading-[1.8]">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL THINKING */}
      <div className="mb-20 lg:mb-28">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">
          {t('aboutPage.opLabel')}
        </p>
        <h2 className="text-[clamp(24px,3.5vw,46px)] font-bold leading-[1.1] mb-8 max-w-[720px] text-white">
          {t('aboutPage.opHeading')}
        </h2>
        <div>
          <p className="text-slate-400 leading-[1.9] text-sm lg:text-base mb-5">
            {t('aboutPage.opBody1')}
          </p>
          <p className="text-slate-400 leading-[1.9] text-sm lg:text-base">
            {t('aboutPage.opBody2')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <CTASection />

    </div>
  )
}
