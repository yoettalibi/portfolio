export type Locale = 'en' | 'fr'

/** A field stored per-locale; null means "not translated" for that locale. */
export type Localized<T> = { en: T | null; fr: T | null }

export interface Project {
  id: number
  slug: string
  title: Localized<string>
  category: Localized<string>
  description: Localized<string>
  tags: Localized<string[]>
  image_url: string | null
  url: string | null
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

/** Pick the active locale, falling back to EN when untranslated. */
export function pick<T>(field: Localized<T> | null | undefined, lang: string): T | null {
  if (!field) return null
  const l: Locale = lang === 'fr' ? 'fr' : 'en'
  return field[l] ?? field.en
}

/** Empty per-locale form state used by the dashboard project form. */
export interface ProjectFormLocale {
  title: string
  category: string
  description: string
  tags: string[]
}

export const emptyLocaleForm = (): ProjectFormLocale => ({
  title: '',
  category: '',
  description: '',
  tags: [],
})
