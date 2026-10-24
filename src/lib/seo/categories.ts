import type { InstrumentStatus, InstrumentType } from './schema'
import { locales, type Locale } from './site'

/**
 * Category landing pages. Each locale has its own URL word (docs/seo/README.md §6); ja, ko and el
 * use the English word, because encoded non-Latin URLs are unreadable when shared.
 *
 * Only categories with stock get a page: violins and violas are left out until there are enough
 * instruments to make the page worth indexing.
 */
export const CATEGORIES = {
  cellos: {
    type: 'cello',
    segments: {
      en: 'cellos',
      ro: 'violoncele',
      de: 'celli',
      fr: 'violoncelles',
      nl: 'cellos',
      ja: 'cellos',
      ko: 'cellos',
      el: 'cellos',
    },
  },
  doubleBasses: {
    type: 'contrabass',
    segments: {
      en: 'double-basses',
      ro: 'contrabasi',
      de: 'kontrabaesse',
      fr: 'contrebasses',
      nl: 'contrabassen',
      ja: 'double-basses',
      ko: 'double-basses',
      el: 'double-basses',
    },
  },
} as const satisfies Record<string, { type: InstrumentType; segments: Record<Locale, string> }>

export type CategoryKey = keyof typeof CATEGORIES
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[]

export function categoryPath(key: CategoryKey, locale: Locale): string {
  return `/${CATEGORIES[key].segments[locale]}`
}

export function categoryPaths(key: CategoryKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, categoryPath(key, l)])) as Record<Locale, string>
}

export type CategoryMatch = { key: CategoryKey; isCanonical: boolean }

/**
 * Maps a URL segment to a category. A segment that belongs to another locale (`/de/cellos`) or
 * differs only in case (`/en/Cellos`) still matches, with `isCanonical: false`, so the page can
 * redirect to the locale's own word.
 */
export function resolveCategory(locale: Locale, segment: string): CategoryMatch | null {
  const lower = segment.toLowerCase()
  for (const key of CATEGORY_KEYS) {
    if (CATEGORIES[key].segments[locale] === lower) {
      return { key, isCanonical: segment === lower }
    }
  }
  for (const key of CATEGORY_KEYS) {
    if ((Object.values(CATEGORIES[key].segments) as string[]).includes(lower)) {
      return { key, isCanonical: false }
    }
  }
  return null
}

const STATUS_ORDER: Record<InstrumentStatus, number> = {
  available: 0,
  'in-build': 1,
  reserved: 2,
  sold: 3,
}

/** Available first, sold last. Keeps the incoming order (newest first) within each status. */
export function sortByStatus<T extends { status: InstrumentStatus }>(list: readonly T[]): T[] {
  return [...list].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}

export const WOODS = ['maple', 'alder', 'ash', 'poplar'] as const
export type Wood = (typeof WOODS)[number]

// `bodyWood` is free text typed in the admin ("Very well flamed romanian maple", "mapple").
const WOOD_PATTERNS: Record<Wood, RegExp> = {
  maple: /\bmap+le\b/i,
  alder: /\balder\b/i,
  ash: /\bash\b/i,
  poplar: /\bpoplar\b/i,
}

type StatsInstrument = {
  status: InstrumentStatus
  price?: number | null
  model?: string | null
  specs?: { bodyWood?: string | null } | null
}

export type CategoryStats = {
  /** Instruments with status `available`. */
  available: number
  /** Lowest and highest listed price among available instruments; null when none has a price. */
  minPrice: number | null
  maxPrice: number | null
  /** Model names, most common first. */
  models: string[]
  /** Back and ribs woods, most common first. */
  woods: Wood[]
}

function byFrequency<T>(values: T[]): T[] {
  const counts = new Map<T, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v)
}

/**
 * Facts for a category page, computed from live data so the copy never goes stale. Models and
 * woods come from the instruments for sale, or from every instrument when none is for sale.
 */
export function categoryStats(list: readonly StatsInstrument[]): CategoryStats {
  const forSale = list.filter((i) => i.status === 'available')
  const prices = forSale
    .map((i) => i.price)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  const pool = forSale.length > 0 ? forSale : list

  const models = byFrequency(
    pool.map((i) => i.model?.trim()).filter((m): m is string => Boolean(m)),
  )
  const woods = byFrequency(
    pool.flatMap((i) => WOODS.filter((w) => WOOD_PATTERNS[w].test(i.specs?.bodyWood ?? ''))),
  )

  return {
    available: forSale.length,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    maxPrice: prices.length > 0 ? Math.max(...prices) : null,
    models,
    woods,
  }
}

/** "A, B and C" in the visitor's language. */
export function formatList(locale: string, items: readonly string[]): string {
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items)
}
