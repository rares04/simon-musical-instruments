import type { MetadataRoute } from 'next'
import { getMediaSrc } from '@/lib/media-utils'
import { buildAlternates, localesWithText } from './alternates'
import { CATEGORY_KEYS, categoryPaths } from './categories'
import { absoluteUrl, locales, localizedPath, SITE_URL, type Locale } from './site'

/** Public, indexable pages that exist in every locale. */
export const STATIC_PATHS = ['/', '/gallery', '/photos', '/faq', '/contact'] as const

/** An instrument as returned by Payload with `locale: 'all'` (localized fields become objects). */
export type SitemapInstrument = {
  id: number
  slug?: string | null
  updatedAt: string
  luthierNotes?: Partial<Record<Locale, string | null>> | null
  mainImage?: number | { url?: string | null } | null
}

export function instrumentPath(doc: Pick<SitemapInstrument, 'id' | 'slug'>): string {
  return `/gallery/${doc.slug || doc.id}`
}

function entriesFor(
  path: string | Record<Locale, string>,
  translated: readonly Locale[],
  siteUrl: string,
  extra: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'> = {},
): MetadataRoute.Sitemap {
  const paths = typeof path === 'string' ? undefined : path
  const pathFor = (l: Locale) => (typeof path === 'string' ? path : path[l])
  return translated.map((locale) => {
    const { languages } = buildAlternates({
      locale,
      path: pathFor(locale),
      paths,
      translatedLocales: translated,
      siteUrl,
    })
    return {
      url: absoluteUrl(localizedPath(locale, pathFor(locale)), siteUrl),
      alternates: { languages },
      ...extra,
    }
  })
}

/**
 * One entry per page and per translated locale, with the same hreflang set the page itself
 * declares (both come from `buildAlternates`).
 */
export function toSitemapEntries(
  instruments: SitemapInstrument[],
  siteUrl: string = SITE_URL,
): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.flatMap((path) => entriesFor(path, locales, siteUrl))
  const categoryEntries = CATEGORY_KEYS.flatMap((key) =>
    entriesFor(categoryPaths(key), locales, siteUrl),
  )

  const instrumentEntries = instruments.flatMap((doc) => {
    const image =
      doc.mainImage && typeof doc.mainImage === 'object'
        ? getMediaSrc(doc.mainImage.url ?? null)
        : null
    return entriesFor(instrumentPath(doc), localesWithText(doc.luthierNotes), siteUrl, {
      lastModified: doc.updatedAt,
      ...(image ? { images: [absoluteUrl(image, siteUrl)] } : {}),
    })
  })

  return [...staticEntries, ...categoryEntries, ...instrumentEntries]
}
