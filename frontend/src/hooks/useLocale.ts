import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export type Locale = 'en' | 'fr' | 'ar'

export const LOCALES: { code: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

export function useLocale() {
  const { i18n } = useTranslation()
  const current = (i18n.language?.slice(0, 2) as Locale) ?? 'en'
  const isRTL = current === 'ar'

  useEffect(() => {
    document.documentElement.lang = current
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [current, isRTL])

  function changeLocale(code: Locale) {
    i18n.changeLanguage(code)
  }

  return { current, isRTL, changeLocale, locales: LOCALES }
}
