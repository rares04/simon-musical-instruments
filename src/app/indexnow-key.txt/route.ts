import { indexNowKey } from '@/lib/seo/indexnow'

export const dynamic = 'force-dynamic'

/** The IndexNow key file. Search engines fetch it to check that pings come from this site. */
export function GET(): Response {
  const key = indexNowKey()
  if (!key) return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
