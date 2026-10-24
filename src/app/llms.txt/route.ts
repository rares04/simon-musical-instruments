import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import config from '@payload-config'
import { instrumentTitle } from '@/lib/seo/instrument-text'
import { buildLlmsTxt } from '@/lib/seo/llms'

// The database isn't reachable at build time.
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const [{ docs }, t] = await Promise.all([
    payload.find({
      collection: 'instruments',
      locale: 'en',
      depth: 0,
      limit: 100,
      sort: '-createdAt',
      overrideAccess: false,
    }),
    getTranslations({ locale: 'en', namespace: 'seo' }),
  ])

  const body = buildLlmsTxt(docs.map((doc) => ({ ...doc, name: instrumentTitle(t, doc) })))
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
