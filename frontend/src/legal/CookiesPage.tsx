import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { LegalPageLayout } from './LegalPageLayout'

export default function CookiesPage() {
  const { t } = useTranslation()

  useSeo({
    title: t('legal.cookies.seo.title'),
    description: t('legal.cookies.seo.description'),
    canonical: 'https://ettalibi.com/cookies',
    noIndex: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://ettalibi.com/cookies#webpage',
          url: 'https://ettalibi.com/cookies',
          name: 'Cookies Policy — ET-TALIBI',
          isPartOf: { '@id': 'https://ettalibi.com/#website' },
          inLanguage: 'en',
          breadcrumb: { '@id': 'https://ettalibi.com/cookies#breadcrumb' },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://ettalibi.com/cookies#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ettalibi.com' },
            { '@type': 'ListItem', position: 2, name: 'Cookies Policy' },
          ],
        },
      ],
    },
  })

  return <LegalPageLayout namespace="cookies" />
}
