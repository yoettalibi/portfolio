import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { LegalPageLayout } from './LegalPageLayout'

export default function PrivacyPage() {
  const { t } = useTranslation()

  useSeo({
    title: t('legal.privacy.seo.title'),
    description: t('legal.privacy.seo.description'),
    canonical: 'https://ettalibi.com/privacy',
    noIndex: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://ettalibi.com/privacy#webpage',
          url: 'https://ettalibi.com/privacy',
          name: 'Privacy Policy — ET-TALIBI',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          inLanguage: 'en',
          breadcrumb: { '@id': 'https://ettalibi.com/privacy#breadcrumb' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://ettalibi.com/privacy#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: 'Privacy Policy' },
          ],
        },
      ],
    },
  })

  return <LegalPageLayout namespace="privacy" />
}
