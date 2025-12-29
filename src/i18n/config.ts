export const locales = ['en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ro: 'Română',
  de: 'Deutsch',
  fr: 'Français',
  nl: 'Nederlands',
  ja: '日本語',
  ko: '한국어',
  el: 'Ελληνικά',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ro: '🇷🇴',
  de: '🇩🇪',
  fr: '🇫🇷',
  nl: '🇳🇱',
  ja: '🇯🇵',
  ko: '🇰🇷',
  el: '🇬🇷',
}
