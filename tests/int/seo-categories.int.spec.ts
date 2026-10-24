import { describe, expect, it } from 'vitest'
import type { AbstractIntlMessages } from 'next-intl'
import { buildAlternates } from '@/lib/seo/alternates'
import {
  CATEGORY_KEYS,
  categoryPaths,
  categoryStats,
  resolveCategory,
  sortByStatus,
} from '@/lib/seo/categories'
import type { CategoryTranslator } from '@/lib/seo/category-text'
import { collectionPageNode } from '@/lib/seo/schema'
import { locales, type Locale } from '@/lib/seo/site'
import { toSitemapEntries } from '@/lib/seo/sitemap'

const SITE = 'https://simoninstruments.com'

describe('resolveCategory', () => {
  it("matches each locale's own word as canonical", () => {
    expect(resolveCategory('en', 'cellos')).toEqual({ key: 'cellos', isCanonical: true })
    expect(resolveCategory('ro', 'violoncele')).toEqual({ key: 'cellos', isCanonical: true })
    expect(resolveCategory('de', 'kontrabaesse')).toEqual({
      key: 'doubleBasses',
      isCanonical: true,
    })
    // nl shares the English word.
    expect(resolveCategory('nl', 'cellos')).toEqual({ key: 'cellos', isCanonical: true })
  })

  it("flags another locale's word or the wrong case, so the page can redirect", () => {
    expect(resolveCategory('de', 'cellos')).toEqual({ key: 'cellos', isCanonical: false })
    expect(resolveCategory('en', 'violoncele')).toEqual({ key: 'cellos', isCanonical: false })
    expect(resolveCategory('en', 'Cellos')).toEqual({ key: 'cellos', isCanonical: false })
  })

  it('returns null for anything else, so the page 404s', () => {
    expect(resolveCategory('en', 'violins')).toBeNull()
    expect(resolveCategory('en', 'home.html')).toBeNull()
  })

  it('never uses a word that a static route already owns', () => {
    const reserved = ['gallery', 'photos', 'faq', 'contact', 'account', 'checkout', 'login']
    for (const key of CATEGORY_KEYS) {
      for (const path of Object.values(categoryPaths(key))) {
        expect(reserved).not.toContain(path.slice(1))
      }
    }
  })
})

describe('per-locale paths in hreflang and the sitemap', () => {
  it('points each hreflang at that locale’s own URL word', () => {
    const a = buildAlternates({
      locale: 'de',
      path: '/celli',
      paths: categoryPaths('cellos'),
      siteUrl: SITE,
    })
    expect(a.canonical).toBe(`${SITE}/de/celli`)
    expect(a.languages.ro).toBe(`${SITE}/ro/violoncele`)
    expect(a.languages.fr).toBe(`${SITE}/fr/violoncelles`)
    expect(a.languages['x-default']).toBe(`${SITE}/en/cellos`)
  })

  it('lists every category in every locale with matching alternates', () => {
    const entries = toSitemapEntries([], SITE)
    const bassRo = entries.find((e) => e.url === `${SITE}/ro/contrabasi`)
    expect(bassRo?.alternates?.languages).toMatchObject({
      de: `${SITE}/de/kontrabaesse`,
      nl: `${SITE}/nl/contrabassen`,
      'x-default': `${SITE}/en/double-basses`,
    })
    const categoryUrls = entries.filter((e) =>
      CATEGORY_KEYS.some((k) => Object.values(categoryPaths(k)).some((p) => e.url.endsWith(p))),
    )
    expect(categoryUrls).toHaveLength(CATEGORY_KEYS.length * locales.length)
  })
})

describe('categoryStats', () => {
  const list = [
    {
      status: 'available' as const,
      price: 6500,
      model: 'Stradivari Davidoff',
      specs: { bodyWood: 'Well flamed romanian alder' },
    },
    {
      status: 'available' as const,
      price: 3660,
      model: 'Goffriller',
      specs: { bodyWood: 'Very well flamed mapple' },
    },
    {
      status: 'available' as const,
      price: null,
      model: 'Stradivari Davidoff ',
      specs: { bodyWood: 'Very well flamed romanian ash' },
    },
    {
      status: 'sold' as const,
      price: 9999,
      model: 'Ceruti',
      specs: { bodyWood: 'Flamed romanian poplar' },
    },
  ]

  it('prices only what is for sale and orders models by frequency', () => {
    expect(categoryStats(list)).toEqual({
      available: 3,
      minPrice: 3660,
      maxPrice: 6500,
      models: ['Stradivari Davidoff', 'Goffriller'],
      woods: ['alder', 'maple', 'ash'],
    })
  })

  it('lists in British English, without a serial comma', async () => {
    const { formatList } = await import('@/lib/seo/categories')
    expect(formatList('en', ['maple', 'alder', 'ash'])).toBe('maple, alder and ash')
    expect(formatList('ro', ['paltin', 'arin', 'frasin'])).toBe('paltin, arin și frasin')
  })

  it('falls back to every instrument when nothing is for sale', () => {
    const stats = categoryStats([list[3]])
    expect(stats).toMatchObject({ available: 0, minPrice: null, models: ['Ceruti'] })
    expect(stats.woods).toEqual(['poplar'])
  })

  it('sorts available first and sold last, keeping order within a status', () => {
    const sorted = sortByStatus([
      { id: 1, status: 'sold' as const },
      { id: 2, status: 'available' as const },
      { id: 3, status: 'reserved' as const },
      { id: 4, status: 'available' as const },
    ])
    expect(sorted.map((i) => i.id)).toEqual([2, 4, 3, 1])
  })
})

describe('category copy', async () => {
  const { createTranslator } = await import('next-intl')
  const { categoryCopy } = await import('@/lib/seo/category-text')
  const messages = Object.fromEntries(
    await Promise.all(
      locales.map(async (l) => [l, (await import(`../../messages/${l}.json`)).default] as const),
    ),
  ) as Record<Locale, AbstractIntlMessages>
  const tFor = (locale: Locale) =>
    createTranslator({
      locale,
      messages: messages[locale],
      namespace: 'categoryPage',
    }) as unknown as CategoryTranslator

  const stats = {
    available: 7,
    minPrice: 3660,
    maxPrice: 6500,
    models: ['Stradivari Davidoff', 'Goffriller'],
    woods: ['maple', 'alder'] as ('maple' | 'alder')[],
  }

  it('writes an answer-first intro with live models and prices', () => {
    const copy = categoryCopy(tFor('en'), 'en', 'cellos', stats)
    expect(copy.h1).toBe('Handmade cellos')
    expect(copy.intro).toContain('Current models: Stradivari Davidoff and Goffriller.')
    expect(copy.stock).toBe('7 cellos are available now. Prices: €3,660 to €6,500.')
    expect(copy.facts.find((f) => f.label === 'Back and ribs')?.value).toBe('Maple and alder')
    expect(copy.faq.map((q) => q.question)).toEqual([
      'How much does a handmade cello cost?',
      'What size are your cellos?',
      'Which woods do you use?',
      'How do I buy one?',
    ])
  })

  it('uses Romanian plural forms and the formal register', () => {
    const t = tFor('ro')
    expect(categoryCopy(t, 'ro', 'cellos', { ...stats, available: 1 }).stock).toMatch(
      /^Un violoncel este disponibil acum\./,
    )
    expect(categoryCopy(t, 'ro', 'cellos', { ...stats, available: 3 }).stock).toMatch(
      /^3 violoncele sunt/,
    )
    expect(categoryCopy(t, 'ro', 'doubleBasses', { ...stats, available: 21 }).stock).toMatch(
      /^21 de contrabași sunt/,
    )
    const howToBuy = categoryCopy(t, 'ro', 'cellos', stats).faq.at(-1)?.answer ?? ''
    expect(howToBuy).toContain('Rezervați')
    // Split on whitespace: `\b` treats ș and ț as word boundaries.
    const words = howToBuy.toLowerCase().split(/[\s.,;:!?]+/)
    for (const informal of ['te', 'tu', 'ta', 'tău', 'tine']) expect(words).not.toContain(informal)
  })

  it('handles price on request and an empty category', () => {
    const t = tFor('en')
    const noPrice = categoryCopy(t, 'en', 'doubleBasses', {
      ...stats,
      available: 1,
      minPrice: null,
      maxPrice: null,
    })
    expect(noPrice.stock).toBe('One double bass is available now. Prices on request.')
    expect(noPrice.faq.map((q) => q.question)).not.toContain(
      'How much does a handmade double bass cost?',
    )
    expect(noPrice.facts.find((f) => f.label === 'Price')?.value).toBe('On request')

    const empty = categoryCopy(t, 'en', 'cellos', { ...stats, available: 0 })
    expect(empty.stock).toBe('Nothing is available right now. Contact us about a commission.')
    expect(empty.facts.map((f) => f.label)).not.toContain('Price')
  })

  it('writes euro amounts with the € sign in every locale', async () => {
    const { formatEuro } = await import('@/lib/seo/instrument-text')
    expect(formatEuro('ro', 6500)).toMatch(/^6\.500\s€$/)
    expect(formatEuro('en', 6500)).toBe('€6,500')
    for (const locale of locales) expect(formatEuro(locale, 6500)).not.toContain('EUR')
  })

  it('leaves no placeholder unfilled in any locale', () => {
    for (const locale of locales) {
      for (const key of CATEGORY_KEYS) {
        const copy = categoryCopy(tFor(locale), locale, key, stats)
        const strings = [
          copy.h1,
          copy.intro,
          copy.stock,
          ...copy.facts.flatMap((f) => [f.label, f.value]),
          ...copy.faq.flatMap((q) => [q.question, q.answer]),
        ]
        for (const text of strings) {
          expect(text, `${locale} ${key}`).not.toMatch(/[{}]|categoryPage\./)
        }
      }
    }
  })
})

describe('collectionPageNode', () => {
  it('lists the instruments in order', () => {
    const node = collectionPageNode(
      {
        url: `${SITE}/en/cellos`,
        name: 'Handmade cellos',
        description: 'd',
        locale: 'en',
        items: [
          { url: `${SITE}/en/gallery/a`, name: 'A' },
          { url: `${SITE}/en/gallery/b`, name: 'B' },
        ],
      },
      SITE,
    )
    expect(node['@type']).toBe('CollectionPage')
    expect(node.mainEntity).toMatchObject({
      '@type': 'ItemList',
      numberOfItems: 2,
      itemListElement: [
        { '@type': 'ListItem', position: 1, url: `${SITE}/en/gallery/a` },
        { '@type': 'ListItem', position: 2, url: `${SITE}/en/gallery/b` },
      ],
    })
  })
})
