import { clientConfig, isAdminPath } from '@/lib/observability/client-config'

// Browser analytics (PostHog EU). Runs before hydration on every page. Off without a key, and never
// on the Payload admin, whose pages show customer names and emails. posthog-js is loaded only when
// it will run, so pages without analytics don't pay for it.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key && !isAdminPath(window.location.pathname)) {
  void import('posthog-js').then(({ default: posthog }) => {
    posthog.init(
      key,
      clientConfig({
        apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
        appEnv: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,
        appVersion: (process.env.NEXT_PUBLIC_APP_VERSION || 'local').slice(0, 7),
      }),
    )
  })
}
