import { PostHog } from 'posthog-node'
import { scrubProperties } from './scrub'

const DEFAULT_HOST = 'https://eu.i.posthog.com'

let client: PostHog | null | undefined

/** Properties every server event carries. */
export function appContext(): Record<string, string> {
  return {
    app_env: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development',
    app_version: (process.env.RAILWAY_GIT_COMMIT_SHA || 'local').slice(0, 7),
  }
}

/**
 * The server-side PostHog client, or `null` when analytics is off (no key, or tests).
 * GeoIP is disabled: server events come from Railway's IP, and would all show up as the
 * data-centre country.
 */
export function getServerPostHog(): PostHog | null {
  if (client !== undefined) return client
  // Server code only. (Not `import 'server-only'`: Payload's CLI and instrumentation.ts load this
  // module outside the React Server build, where that import throws.)
  if (typeof window !== 'undefined') return null
  const key = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key || process.env.NODE_ENV === 'test' || process.env.POSTHOG_DISABLED === 'true') {
    client = null
    return client
  }
  client = new PostHog(key, {
    host: process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_HOST,
    disableGeoip: true,
    // Low volume: send each event right away instead of batching.
    flushAt: 1,
    flushInterval: 0,
    // Last line of defence: nothing personal leaves the server, whatever a call site passes.
    before_send: (event) => {
      if (!event) return null
      event.properties = scrubProperties(event.properties ?? {})
      return event
    },
  })
  const shutdown = () => {
    void client?.shutdown(2000)
  }
  process.once('SIGTERM', shutdown)
  process.once('beforeExit', shutdown)
  return client
}
