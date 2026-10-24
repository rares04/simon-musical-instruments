import { describe, expect, it } from 'vitest'
import { buildAlternates, localesWithText } from '@/lib/seo/alternates'
import { buildMetadata, withBrand } from '@/lib/seo/metadata'
import { AVAILABILITY, productNode, type ProductInput } from '@/lib/seo/schema'
import { resolveSiteUrl } from '@/lib/seo/site'
import { STATIC_PATHS, toSitemapEntries } from '@/lib/seo/sitemap'
import { serializeJsonLd } from '@/components/seo/json-ld'
import robots from '@/app/robots'
import type { AbstractIntlMessages } from 'next-intl'
import type { SeoTranslator } from '@/lib/seo/instrument-text'

const SITE = 'https://simoninstruments.com'

describe('resolveSiteUrl', () => {
  it('defaults to production and keeps only the origin', () => {
    expect(resolveSiteUrl(undefined)).toBe(SITE)
    expect(resolveSiteUrl('not a url')).toBe(SITE)
    expect(resolveSiteUrl('https://staging.example.com/some/path')).toBe(
      'https://staging.example.com',
    )
  })
})

describe('buildAlternates', () => {
  it('gives a translated page a self canonical and lists every locale', () => {
    const a = buildAlternates({ locale: 'ro', path: '/faq', siteUrl: SITE })
    expect(a.canonical).toBe(`${SITE}/ro/faq`)
    expect(Object.keys(a.languages)).toHaveLength(9)
    expect(a.languages['x-default']).toBe(`${SITE}/en/faq`)
  })

  it('points an untranslated locale at the default locale and leaves it out of hreflang', () => {
    const a = buildAlternates({
      locale: 'ja',
      path: '/gallery/cello-1',
      translatedLocales: ['en', 'ro'],
      siteUrl: SITE,
    })
    expect(a.canonical).toBe(`${SITE}/en/gallery/cello-1`)
    expect(a.languages).toEqual({
      en: `${SITE}/en/gallery/cello-1`,
      ro: `${SITE}/ro/gallery/cello-1`,
      'x-default': `${SITE}/en/gallery/cello-1`,
    })
  })

  it('always keeps the default locale, even if the list omits it', () => {
    const a = buildAlternates({
      locale: 'ro',
      path: '/x',
      translatedLocales: ['ro'],
      siteUrl: SITE,
    })
    expect(a.languages.en).toBe(`${SITE}/en/x`)
  })

  it('sends the home page x-default to the language-detecting root', () => {
    const a = buildAlternates({ locale: 'en', path: '/', siteUrl: SITE })
    expect(a.canonical).toBe(`${SITE}/en`)
    expect(a.languages['x-default']).toBe(`${SITE}/`)
  })
})

describe('localesWithText', () => {
  it('returns the locales that have their own text', () => {
    expect(localesWithText({ en: 'Notes', ro: 'Note', de: '  ', fr: null })).toEqual(['en', 'ro'])
  })

  it('treats every locale as translated when the default text is empty', () => {
    expect(localesWithText({ en: '' })).toHaveLength(8)
    expect(localesWithText(null)).toHaveLength(8)
  })
})

describe('buildMetadata', () => {
  it('builds absolute, self-contained metadata', () => {
    const m = buildMetadata({
      locale: 'de',
      path: '/faq',
      title: 'Häufige Fragen',
      description: 'd',
      siteUrl: SITE,
    })
    expect(m.title).toEqual({ absolute: 'Häufige Fragen | Simon Musical Instruments' })
    expect(m.alternates?.canonical).toBe(`${SITE}/de/faq`)
    expect(m.openGraph).toMatchObject({ locale: 'de_DE', url: `${SITE}/de/faq` })
    const alt = (m.openGraph as { alternateLocale: string[] }).alternateLocale
    expect(alt).not.toContain('de_DE')
    expect(alt).toHaveLength(7)
    expect(m.robots).toEqual({ index: true, follow: true })
  })

  it('marks private pages noindex', () => {
    const m = buildMetadata({
      locale: 'en',
      path: '/account',
      title: 'A',
      description: 'd',
      noindex: true,
    })
    expect(m.robots).toEqual({ index: false, follow: true })
  })

  it('drops the brand suffix on long titles', () => {
    expect(withBrand('Short')).toBe('Short | Simon Musical Instruments')
    const long = 'Handmade cello, Stradivari Davidov model, 2025, flamed alder back'
    expect(withBrand(long)).toBe(long)
  })
})

describe('productNode', () => {
  const base: ProductInput = {
    url: `${SITE}/en/gallery/cello-1`,
    name: 'Handmade cello',
    images: [`${SITE}/api/media/file/a.jpg`],
    sku: '21',
    type: 'cello',
    model: 'Stradivari Davidov',
    year: 2025,
    status: 'available',
    materials: ['Flamed alder', null, ''],
  }

  it('adds an Offer with a fixed-decimal EUR price when there is a price', () => {
    const p = productNode({ ...base, price: 6500 }, SITE)
    expect(p.offers).toMatchObject({
      price: '6500.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    })
    expect(p.material).toBe('Flamed alder')
    expect(p.productionDate).toBe('2025')
  })

  it('omits offers for "price on request" instruments', () => {
    expect(productNode({ ...base, price: null }, SITE).offers).toBeUndefined()
  })

  it('maps every status to a Google-supported availability', () => {
    expect(AVAILABILITY).toEqual({
      available: 'https://schema.org/InStock',
      reserved: 'https://schema.org/OutOfStock',
      'in-build': 'https://schema.org/PreOrder',
      sold: 'https://schema.org/SoldOut',
    })
  })

  it('attaches the audio sample', () => {
    const p = productNode({ ...base, audioUrl: `${SITE}/api/media/file/a.mp3` }, SITE)
    expect(p.subjectOf).toMatchObject({ '@type': 'AudioObject', encodingFormat: 'audio/mpeg' })
  })
})

describe('serializeJsonLd', () => {
  it('cannot close the script tag', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(out).not.toContain('</script>')
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>')
  })
})

describe('toSitemapEntries', () => {
  const entries = toSitemapEntries(
    [
      {
        id: 21,
        slug: 'Cello-4-4(10)',
        updatedAt: '2026-10-01T00:00:00.000Z',
        luthierNotes: { en: 'Notes', ro: 'Note' },
        mainImage: { url: '/api/media/file/cello.jpg' },
      },
      { id: 30, slug: null, updatedAt: '2026-10-02T00:00:00.000Z', luthierNotes: { en: 'x' } },
    ],
    SITE,
  )

  it('lists static pages in all 8 locales', () => {
    const staticUrls = entries.filter((e) => !e.url.includes('/gallery/'))
    expect(staticUrls).toHaveLength(STATIC_PATHS.length * 8)
    expect(staticUrls.map((e) => e.url)).toContain(`${SITE}/ro`)
  })

  it('lists an instrument only in its translated locales, with matching hreflang', () => {
    const cello = entries.filter((e) => e.url.includes('Cello-4-4(10)'))
    expect(cello.map((e) => e.url)).toEqual([
      `${SITE}/en/gallery/Cello-4-4(10)`,
      `${SITE}/ro/gallery/Cello-4-4(10)`,
    ])
    expect(Object.keys(cello[0].alternates?.languages ?? {})).toEqual(['en', 'ro', 'x-default'])
    expect(cello[0].images).toEqual([`${SITE}/api/media/file/cello.jpg`])
    expect(cello[0].lastModified).toBe('2026-10-01T00:00:00.000Z')
  })

  it('falls back to the id when there is no slug', () => {
    expect(entries.map((e) => e.url)).toContain(`${SITE}/en/gallery/30`)
  })
})

describe('robots', () => {
  it('allows media and AI crawlers, blocks admin and API, links the sitemap', () => {
    const r = robots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toContain('/api/media/file/')
    expect(rule.disallow).toEqual(['/admin', '/api/'])
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/)
  })
})

describe('instrument text', async () => {
  const { createTranslator } = await import('next-intl')
  const { instrumentDescription, instrumentTitle } = await import('@/lib/seo/instrument-text')
  const en = (await import('../../messages/en.json')).default
  const de = (await import('../../messages/de.json')).default
  // Loosely typed messages, as in the app (no global next-intl key augmentation).
  const tEn = createTranslator({
    locale: 'en',
    messages: en as AbstractIntlMessages,
    namespace: 'seo',
  }) as unknown as SeoTranslator
  const tDe = createTranslator({
    locale: 'de',
    messages: de as AbstractIntlMessages,
    namespace: 'seo',
  }) as unknown as SeoTranslator
  const cello = {
    title: 'Cello 4/4',
    model: 'Stradivari Davidoff',
    year: 2025,
    price: 6500,
    status: 'available' as const,
  }

  it('builds localized titles and keeps the year unformatted', () => {
    expect(instrumentTitle(tEn, cello)).toBe('Cello 4/4, handmade Stradivari Davidoff model, 2025')
    expect(instrumentTitle(tDe, { ...cello, title: 'Violoncello 4/4' })).toBe(
      'Violoncello 4/4 vom Geigenbauer, nach Stradivari Davidoff, 2025',
    )
    expect(instrumentTitle(tEn, { ...cello, model: '  ' })).toBe('Cello 4/4, handmade, 2025')
  })

  it('states price, price on request, reserved or sold', () => {
    expect(instrumentDescription(tEn, 'en', cello)).toContain('Price: €6,500.')
    expect(instrumentDescription(tEn, 'en', { ...cello, price: null })).toContain(
      'Price on request.',
    )
    expect(instrumentDescription(tEn, 'en', { ...cello, status: 'sold' })).toContain('Sold.')
    expect(instrumentDescription(tDe, 'de', cello)).toContain('6.500')
  })

  it('keeps the brand out of titles that already contain it', () => {
    const m = buildMetadata({
      locale: 'en',
      path: '/',
      title: 'Simon Musical Instruments, luthiers',
      description: 'd',
      brandSuffix: false,
    })
    expect(m.title).toEqual({ absolute: 'Simon Musical Instruments, luthiers' })
  })
})

describe('seo messages', async () => {
  const fs = await import('node:fs')
  const path = await import('node:path')
  const keys = (o: Record<string, unknown>, p = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === 'object' ? keys(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`],
    )
  const load = (l: string) =>
    JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages', `${l}.json`), 'utf8')).seo
  const ref = keys(load('en')).sort()

  it.each(['ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'])('%s has the same seo keys as en', (l) => {
    expect(keys(load(l)).sort()).toEqual(ref)
  })
})
