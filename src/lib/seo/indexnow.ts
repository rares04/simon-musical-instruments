import { CATEGORY_KEYS, CATEGORIES, categoryPath } from './categories'
import type { InstrumentType } from './schema'
import { absoluteUrl, locales, localizedPath, SITE_URL } from './site'
import { instrumentPath } from './sitemap'

/**
 * IndexNow (https://www.indexnow.org) tells Bing, and through it ChatGPT search, plus Yandex,
 * Seznam and Naver, that a URL changed, so they recrawl within hours instead of weeks.
 * Google doesn't use it; it relies on the sitemap.
 */
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
export const INDEXNOW_KEY_PATH = '/indexnow-key.txt'

const KEY_FORMAT = /^[a-zA-Z0-9-]{8,128}$/

/**
 * The key, only in production. Needs both `INDEXNOW_KEY` and `NEXT_PUBLIC_APP_ENV=production`,
 * so local runs and previews never ping.
 */
export function indexNowKey(env: Record<string, string | undefined> = process.env): string | null {
  const key = env.INDEXNOW_KEY?.trim()
  if (!key || !KEY_FORMAT.test(key)) return null
  return env.NEXT_PUBLIC_APP_ENV === 'production' ? key : null
}

type IndexNowInstrument = { id: number; slug?: string | null; instrumentType?: InstrumentType }

/**
 * URLs that change when an instrument changes: its page in every locale (including the old slug
 * after a rename) and its category page.
 */
export function instrumentChangeUrls(
  doc: IndexNowInstrument,
  previous?: IndexNowInstrument | null,
  siteUrl = SITE_URL,
): string[] {
  const paths = new Set([instrumentPath(doc)])
  if (previous && previous.slug !== doc.slug) paths.add(instrumentPath(previous))
  const urls = locales.flatMap((l) =>
    [...paths].map((p) => absoluteUrl(localizedPath(l, p), siteUrl)),
  )
  const category = CATEGORY_KEYS.find((k) => CATEGORIES[k].type === doc.instrumentType)
  if (category) {
    for (const l of locales)
      urls.push(absoluteUrl(localizedPath(l, categoryPath(category, l)), siteUrl))
  }
  return urls
}

const RESEND_AFTER_MS = 10 * 60 * 1000
const lastSent = new Map<string, number>()

/** Drops URLs sent in the last 10 minutes (one save can fire the hook twice, e.g. translation). */
export function dedupe(urls: readonly string[], now = Date.now()): string[] {
  for (const [url, at] of lastSent) if (now - at > RESEND_AFTER_MS) lastSent.delete(url)
  const fresh = [...new Set(urls)].filter((u) => !lastSent.has(u))
  for (const u of fresh) lastSent.set(u, now)
  return fresh
}

type SubmitOptions = {
  key: string
  siteUrl?: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

/** Posts the URLs. Never throws: returns the HTTP status, or null on a network error or timeout. */
export async function submitIndexNow(
  urls: readonly string[],
  { key, siteUrl = SITE_URL, fetchImpl = fetch, timeoutMs = 5000 }: SubmitOptions,
): Promise<number | null> {
  if (urls.length === 0) return null
  try {
    const res = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key,
        keyLocation: `${siteUrl}${INDEXNOW_KEY_PATH}`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
    return res.status
  } catch {
    return null
  }
}
