import { defaultLocale, locales, type Locale } from '@/i18n/config'

const PRODUCTION_URL = 'https://simoninstruments.com'

/** Origin of the canonical site, without a trailing slash. Same source as `src/proxy.ts`. */
export function resolveSiteUrl(raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  if (!raw) return PRODUCTION_URL
  try {
    return new URL(raw).origin
  } catch {
    return PRODUCTION_URL
  }
}

export const SITE_URL = resolveSiteUrl()

export { defaultLocale, locales, type Locale }

/** `/en` + `/gallery` → `/en/gallery`; `/en` + `/` → `/en`. */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

export function absoluteUrl(path: string, siteUrl: string = SITE_URL): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
