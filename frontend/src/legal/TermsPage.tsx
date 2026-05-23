import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { LegalPageLayout } from './LegalPageLayout'

export default function TermsPage() {
  const { t } = useTranslation()

  useSeo({
    title: t('legal.terms.seo.title'),
    description: t('legal.terms.seo.description'),
    canonical: 'https://ettalibi.com/terms',
    noIndex: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://ettalibi.com/terms#webpage',
          url: 'https://ettalibi.com/terms',
          name: 'Terms & Conditions — ET-TALIBI',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          inLanguage: 'en',
          breadcrumb: { '@id': 'https://ettalibi.com/terms#breadcrumb' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://ettalibi.com/terms#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: 'Terms & Conditions' },
          ],
        },
      ],
    },
  })

  return <LegalPageLayout namespace="terms" />
}
