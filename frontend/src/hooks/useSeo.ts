import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description?: string
  canonical?: string
  image?: string
  ogType?: 'website' | 'article' | 'profile'
  jsonLd?: object
  noIndex?: boolean
}

const DEFAULT_IMAGE = 'https://ettalibi.com/og-image.jpg'

function upsertMeta(selector: string, key: 'name' | 'property', keyValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key, keyValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo({
  title,
  description,
  canonical,
  image,
  ogType = 'website',
  jsonLd,
  noIndex = false,
}: SeoOptions) {
  const jsonLdStr = jsonLd != null ? JSON.stringify(jsonLd) : undefined

  useEffect(() => {
    const img = image ?? DEFAULT_IMAGE

    // ── Title ──────────────────────────────────────────────────────
    document.title = title

    // ── Standard meta ─────────────────────────────────────────────
    if (noIndex) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow')
    } else {
      document.querySelector('meta[name="robots"]')?.remove()
    }
    if (description) upsertMeta('meta[name="description"]', 'name', 'description', description)

    // ── Canonical ─────────────────────────────────────────────────
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }

    // ── Open Graph ────────────────────────────────────────────────
    upsertMeta('meta[property="og:type"]',       'property', 'og:type',       ogType)
    upsertMeta('meta[property="og:title"]',      'property', 'og:title',      title)
    upsertMeta('meta[property="og:image"]',      'property', 'og:image',      img)
    upsertMeta('meta[property="og:image:alt"]',  'property', 'og:image:alt',  title)
    upsertMeta('meta[property="og:image:width"]','property', 'og:image:width','1200')
    upsertMeta('meta[property="og:image:height"]','property','og:image:height','630')
    if (description) upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    if (canonical)   upsertMeta('meta[property="og:url"]',         'property', 'og:url',         canonical)

    // ── JSON-LD structured data ────────────────────────────────────
    let scriptLd = document.querySelector<HTMLScriptElement>('script[data-seo-ld]')
    if (jsonLdStr) {
      if (!scriptLd) {
        scriptLd = document.createElement('script')
        scriptLd.setAttribute('type', 'application/ld+json')
        scriptLd.setAttribute('data-seo-ld', '')
        document.head.appendChild(scriptLd)
      }
      scriptLd.textContent = jsonLdStr
    }

    return () => {
      document.querySelector('script[data-seo-ld]')?.remove()
    }
  }, [title, description, canonical, image, ogType, jsonLdStr, noIndex])
}
