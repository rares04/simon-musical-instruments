import type { Metadata } from 'next'
import { buildAlternates } from './alternates'
import { business } from './business'
import { absoluteUrl, locales, SITE_URL, type Locale } from './site'

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB',
  ro: 'ro_RO',
  de: 'de_DE',
  fr: 'fr_FR',
  nl: 'nl_NL',
  ja: 'ja_JP',
  ko: 'ko_KR',
  el: 'el_GR',
}

/** Default share image, 1200×630. */
export const DEFAULT_OG_IMAGE = '/og-default.jpg'

type BuildMetadataInput = {
  locale: Locale
  /** Path without the locale prefix, e.g. `/faq`. */
  path: string
  /** Per-locale paths when the URL word is translated (see `buildAlternates`). */
  paths?: Partial<Record<Locale, string>>
  /** Already translated, without the brand suffix. */
  title: string
  description: string
  /** Absolute or root-relative image URL. */
  image?: string | null
  imageAlt?: string
  translatedLocales?: readonly Locale[]
  noindex?: boolean
  /** Append " | <brand>" when the title fits. Off for titles that already name the brand. */
  brandSuffix?: boolean
  type?: 'website' | 'article'
  siteUrl?: string
}

/**
 * Every public title ends with the brand, which helps search engines tie each page to the
 * workshop. Keywords come first, so when a results page truncates a long title (around 60
 * characters), only the brand suffix is cut.
 */
export function withBrand(title: string): string {
  return `${title} | ${business.name}`
}

/**
 * Page metadata with absolute URLs only, so it doesn't depend on `metadataBase` or the layout's
 * title template.
 */
export function buildMetadata({
  locale,
  path,
  paths,
  title,
  description,
  image,
  imageAlt,
  translatedLocales = locales,
  noindex = false,
  brandSuffix = true,
  type = 'website',
  siteUrl = SITE_URL,
}: BuildMetadataInput): Metadata {
  const alternates = buildAlternates({ locale, path, paths, translatedLocales, siteUrl })
  const fullTitle = brandSuffix ? withBrand(title) : title
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE, siteUrl)

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: alternates.canonical, languages: alternates.languages },
    openGraph: {
      type,
      url: alternates.canonical,
      siteName: business.name,
      title: fullTitle,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: Object.keys(alternates.languages)
        .filter((l): l is Locale => l !== locale && (locales as readonly string[]).includes(l))
        .map((l) => OG_LOCALE[l]),
      images: [{ url: imageUrl, alt: imageAlt ?? title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  }
}

/** Metadata for sign-in, account and checkout pages: translated title, kept out of the index. */
export function privatePageMetadata(locale: Locale, path: string, title: string): Metadata {
  return buildMetadata({ locale, path, title, description: title, noindex: true })
}
