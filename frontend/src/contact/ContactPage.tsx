import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import ContactHeader from './ContactHeader'
import ContactForm from './ContactForm'
import ContactSidebar from './ContactSidebar'
import ContactSuccessCard from './ContactSuccessCard'

export default function ContactPage() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [sentName, setSentName] = useState<string | null>(null)
  const [sentSubjects, setSentSubjects] = useState<string[]>([])

  useSeo({
    title: t('contact.seo.title'),
    description: t('contact.seo.description'),
    canonical: t('contact.seo.canonical'),
    noIndex: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': 'https://ettalibi.com/contact#webpage',
          url: 'https://ettalibi.com/contact',
          name: 'Contact ET-TALIBI',
          description: 'Have a project in mind? Get in touch with ET-TALIBI for web apps, SaaS products, backend systems, and custom software engineering. Reply within 24 hours.',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          inLanguage: 'en',
          breadcrumb: { '@id': 'https://ettalibi.com/contact#breadcrumb' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://ettalibi.com/contact#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: 'Contact' },
          ],
        },
      ],
    },
  })

  function handleSent(firstName: string, subjects: string[]) {
    setSentName(firstName)
    setSentSubjects(subjects)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleReset() {
    setSentName(null)
    setSentSubjects([])
  }

  return (
    <section ref={sectionRef} className="page-container py-20 lg:py-28">
      <ContactHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
        {/* Mobile: show success card here (aside is hidden on mobile) */}
        {sentName !== null ? (
          <ContactSuccessCard firstName={sentName} subjects={sentSubjects} onReset={handleReset} />
        ) : (
          <ContactForm onSent={handleSent} />
        )}
        <ContactSidebar />
      </div>
    </section>
  )
}
