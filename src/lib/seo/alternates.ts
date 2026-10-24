import { absoluteUrl, defaultLocale, locales, localizedPath, SITE_URL, type Locale } from './site'

/**
 * Where the home page's x-default points: the language-detecting root.
 * If Search Console keeps choosing `/` over `/en` as canonical after launch, switch this to
 * `'default-locale'` (see docs/seo/technical-spec.md §2).
 */
export const HOME_X_DEFAULT: 'root' | 'default-locale' = 'root'

export type Alternates = {
  canonical: string
  /** hreflang → absolute URL, including `x-default`. */
  languages: Record<string, string>
}

type BuildAlternatesInput = {
  locale: Locale
  /** Path without the locale prefix, e.g. `/gallery/cello-…` or `/` for home. */
  path: string
  /** Locales whose content exists in their own language. The default locale is always included. */
  translatedLocales?: readonly Locale[]
  siteUrl?: string
}

/**
 * Canonical + hreflang for one page in one locale.
 *
 * - Translated locales get a self-referencing canonical and appear in hreflang.
 * - An untranslated locale still renders, but its canonical points to the default locale and it
 *   is left out of hreflang, so search engines don't index English text under another language.
 * - x-default is the default-locale URL, except on the home page (see `HOME_X_DEFAULT`).
 */
export function buildAlternates({
  locale,
  path,
  translatedLocales = locales,
  siteUrl = SITE_URL,
}: BuildAlternatesInput): Alternates {
  const translated = locales.filter(
    (l) => l === defaultLocale || translatedLocales.includes(l),
  )
  const urlFor = (l: Locale) => absoluteUrl(localizedPath(l, path), siteUrl)

  const isHome = path === '/' || path === ''
  const xDefault =
    isHome && HOME_X_DEFAULT === 'root' ? `${siteUrl}/` : urlFor(defaultLocale)

  const languages: Record<string, string> = {}
  for (const l of translated) languages[l] = urlFor(l)
  languages['x-default'] = xDefault

  return {
    canonical: translated.includes(locale) ? urlFor(locale) : urlFor(defaultLocale),
    languages,
  }
}

/**
 * Locales with real content for a localized text field fetched with `locale: 'all'`.
 * Falls back to "all locales" when the default-locale text is empty: then the page is made of
 * per-locale UI strings only, so every locale counts as translated.
 */
export function localesWithText(
  field: Partial<Record<Locale, string | null | undefined>> | null | undefined,
): Locale[] {
  const has = (l: Locale) => Boolean(field?.[l]?.trim())
  if (!has(defaultLocale)) return [...locales]
  return locales.filter(has)
}
