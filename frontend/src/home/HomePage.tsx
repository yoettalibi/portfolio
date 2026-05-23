import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'
import HeroSection from './HeroSection'
import PrinciplesWorkSection from './PrinciplesWorkSection'
import PhilosophyPage from './PhilosophyPage'
import SystemsSection from './SystemsSection'
import InsightsSection from './InsightsSection'
import AboutSection from './AboutSection'
import CTASection from '../shared/CTASection'

export default function HomePage() {
  const { t } = useTranslation()
  useSeo({
    title: t('home.seo.title'),
    description: t('home.seo.description'),
    canonical: t('home.seo.canonical'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://ettalibi.com/#website',
          url: 'https://ettalibi.com',
          name: 'ET-TALIBI',
          description: 'Engineering Digital Systems',
          inLanguage: ['en', 'fr'],
          publisher: { '@id': 'https://ettalibi.com/#person' },
        },
        {
          '@type': 'WebPage',
          '@id': 'https://ettalibi.com/#webpage',
          url: 'https://ettalibi.com',
          name: 'ET-TALIBI — Engineering Digital Systems',
          description: 'Full-stack software engineer specializing in SaaS products, backend systems, web apps, and scalable digital infrastructure.',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          about: { '@id': 'https://ettalibi.com/#person' },
          inLanguage: 'en',
        },
        {
          '@type': 'Person',
          '@id': 'https://ettalibi.com/#person',
          name: 'ET-TALIBI',
          url: 'https://ettalibi.com',
          image: 'https://ettalibi.com/image.png',
          jobTitle: 'Full-Stack Software Engineer',
          description: 'Full-stack software engineer specializing in SaaS products, backend systems, web apps, and scalable digital infrastructure.',
          sameAs: [
            'https://github.com/yoettalibi',
            'https://www.linkedin.com/in/yoettalibi/',
            'https://www.instagram.com/yoettalibi/',
          ],
          knowsAbout: ['SaaS Development', 'Backend Systems', 'Mobile Applications', 'System Architecture', 'Workflow Automation', 'Laravel', 'React', 'TypeScript'],
          knowsLanguage: ['en', 'fr'],
          skills: 'SaaS platforms, Laravel, React, TypeScript, React Native, System Architecture, REST APIs, MySQL, Workflow Automation',
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Full-Stack Software Engineer',
            skills: 'SaaS, Laravel, React, TypeScript, Mobile Development, System Architecture, REST APIs',
          },
        },
      ],
    },
  })

  const location = useLocation()

  // Scroll-to-section when navigated here from another page (e.g. Contact → Work)
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null
    if (state?.scrollTo) {
      const id = state.scrollTo
      // Double rAF ensures the layout is committed before scrolling —
      // more reliable than a fixed setTimeout.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
      window.history.replaceState({}, '')
    }
  }, [location.state])

  // Scroll-fade animations
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-fade]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-visible', '')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <HeroSection />
      <PrinciplesWorkSection />
      <PhilosophyPage />
      <SystemsSection />
      <InsightsSection />
      <AboutSection />
      <CTASection />
    </>
  )
}
