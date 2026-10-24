import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  dedupe,
  INDEXNOW_ENDPOINT,
  indexNowKey,
  instrumentChangeUrls,
  submitIndexNow,
} from '@/lib/seo/indexnow'
import { buildLlmsTxt, type LlmsInstrument } from '@/lib/seo/llms'

const SITE = 'https://simoninstruments.com'
const KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'

describe('indexNowKey', () => {
  it('is on only with a well-formed key in production', () => {
    expect(indexNowKey({})).toBeNull()
    expect(indexNowKey({ INDEXNOW_KEY: KEY })).toBeNull()
    expect(indexNowKey({ INDEXNOW_KEY: KEY, NEXT_PUBLIC_APP_ENV: 'preview' })).toBeNull()
    expect(indexNowKey({ INDEXNOW_KEY: 'short', NEXT_PUBLIC_APP_ENV: 'production' })).toBeNull()
    expect(indexNowKey({ INDEXNOW_KEY: KEY, NEXT_PUBLIC_APP_ENV: 'production' })).toBe(KEY)
  })
})

describe('instrumentChangeUrls', () => {
  it('covers the page in every locale, the old slug after a rename, and the category', () => {
    const urls = instrumentChangeUrls(
      { id: 4, slug: 'cello-goffriller-2025', instrumentType: 'cello' },
      { id: 4, slug: 'Cello-4-4(10)', instrumentType: 'cello' },
      SITE,
    )
    expect(urls).toHaveLength(8 * 2 + 8)
    expect(urls).toContain(`${SITE}/ja/gallery/cello-goffriller-2025`)
    expect(urls).toContain(`${SITE}/ro/gallery/Cello-4-4(10)`)
    expect(urls).toContain(`${SITE}/de/celli`)
  })

  it('has no category URL for types without a category page', () => {
    expect(
      instrumentChangeUrls({ id: 9, slug: 'v', instrumentType: 'violin' }, null, SITE),
    ).toHaveLength(8)
  })
})

describe('dedupe', () => {
  it('drops URLs sent in the last 10 minutes', () => {
    const t0 = 1_000_000
    expect(dedupe(['a', 'b', 'a'], t0)).toEqual(['a', 'b'])
    expect(dedupe(['a', 'c'], t0 + 60_000)).toEqual(['c'])
    expect(dedupe(['a'], t0 + 11 * 60_000)).toEqual(['a'])
  })
})

describe('submitIndexNow', () => {
  afterEach(() => vi.restoreAllMocks())

  it('posts host, key, key location and URLs', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 202 }))
    const status = await submitIndexNow([`${SITE}/en/cellos`], {
      key: KEY,
      siteUrl: SITE,
      fetchImpl,
    })
    expect(status).toBe(202)
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(INDEXNOW_ENDPOINT)
    expect(JSON.parse(String(init.body))).toEqual({
      host: 'simoninstruments.com',
      key: KEY,
      keyLocation: `${SITE}/indexnow-key.txt`,
      urlList: [`${SITE}/en/cellos`],
    })
  })

  it('never throws, and sends nothing for an empty list', async () => {
    const failing = vi.fn(async () => {
      throw new Error('network down')
    })
    expect(await submitIndexNow(['x'], { key: KEY, fetchImpl: failing })).toBeNull()
    const unused = vi.fn()
    expect(await submitIndexNow([], { key: KEY, fetchImpl: unused })).toBeNull()
    expect(unused).not.toHaveBeenCalled()
  })
})

describe('IndexNow hooks', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  const req = { payload: { logger: { warn: vi.fn() } } }
  const doc = { id: 77, slug: 'cello-hook-test', instrumentType: 'cello' }

  it('pings in production and skips on request', async () => {
    const { indexNowAfterChange } = await import('@/hooks/indexNow')
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('INDEXNOW_KEY', KEY)
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')

    const call = (context: Record<string, unknown>, d = doc) =>
      (indexNowAfterChange as unknown as (a: unknown) => unknown)({
        doc: d,
        previousDoc: d,
        context,
        req,
      })

    expect(call({ skipIndexNow: true })).toBe(doc)
    expect(fetchMock).not.toHaveBeenCalled()

    expect(call({})).toBe(doc)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'development')
    call({}, { ...doc, slug: 'another-slug' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('buildLlmsTxt', () => {
  const instruments: LlmsInstrument[] = [
    {
      id: 1,
      slug: 'cello-a',
      name: 'Cello 4/4, handmade Goffriller model, 2025',
      instrumentType: 'cello',
      status: 'available',
      price: 6500,
      model: 'Goffriller',
      specs: { bodyWood: 'Well flamed romanian maple' },
    },
    {
      id: 2,
      slug: 'cello-b',
      name: 'Cello 4/4, handmade Stradivari Davidoff model, 2024',
      instrumentType: 'cello',
      status: 'available',
      price: null,
      model: 'Stradivari Davidoff',
    },
    {
      id: 3,
      slug: 'bass-sold',
      name: 'Double Bass 3/4, 2023',
      instrumentType: 'contrabass',
      status: 'sold',
      price: 4700,
      model: 'Ceruti',
    },
  ]
  const text = buildLlmsTxt(instruments, SITE)

  it('opens with the name and a one-paragraph summary', () => {
    expect(text.startsWith('# Simon Musical Instruments\n\n> ')).toBe(true)
    expect(text).toContain('Paul-Răzvan Simon and Ecaterina Simon')
    expect(text).toContain('founded in February 2014')
  })

  it('lists live categories and only instruments that are for sale', () => {
    expect(text).toContain(
      `- [Handmade cellos](${SITE}/en/cellos): 2 available now, €6,500. Models: Goffriller and Stradivari Davidoff`,
    )
    expect(text).toContain(`- [Handmade double basses](${SITE}/en/double-basses): 0 available now`)
    expect(text).toContain(
      `- [Cello 4/4, handmade Goffriller model, 2025](${SITE}/en/gallery/cello-a): €6,500. Back and ribs: Well flamed romanian maple`,
    )
    expect(text).toContain('price on request')
    expect(text).not.toContain('bass-sold')
  })

  it('links every other language', () => {
    expect(text).toContain(`- [Română](${SITE}/ro)`)
    expect(text).toContain(`- [日本語](${SITE}/ja)`)
  })
})
