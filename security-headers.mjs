// Security headers (see SECURITY.md), used by next.config.mjs.
//
// The CSP is enforced. Violations are blocked and also sent to /api/csp-report, which logs them.
// Adding a third-party script, image, frame or API? Add its host to the matching directive below,
// or the browser will block it.

/**
 * @param {string | undefined} nodeEnv
 * @returns {string}
 */
export function buildCsp(nodeEnv) {
  // `next dev` (React's dev build) needs eval for debugging features. Never in production.
  const devEval = nodeEnv === 'development' ? " 'unsafe-eval'" : ''
  return [
    "default-src 'self'",
    // Next.js inlines hydration scripts; Turnstile and PostHog load their own scripts.
    `script-src 'self' 'unsafe-inline'${devEval} https://challenges.cloudflare.com https://eu-assets.i.posthog.com`,
    "style-src 'self' 'unsafe-inline'",
    // Google profile pictures are shown unoptimized in the header.
    "img-src 'self' data: blob: https://*.googleusercontent.com",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com https://challenges.cloudflare.com",
    // Turnstile widget and the Google Maps embed on /contact.
    'frame-src https://challenges.cloudflare.com https://www.google.com',
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    // Google sign-in posts to Auth.js, which redirects to accounts.google.com.
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
    'report-uri /api/csp-report',
  ].join('; ')
}

/**
 * @param {string | undefined} nodeEnv
 * @returns {{ key: string, value: string }[]}
 */
export function securityHeaders(nodeEnv) {
  return [
    { key: 'Strict-Transport-Security', value: 'max-age=15552000' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    { key: 'Content-Security-Policy', value: buildCsp(nodeEnv) },
  ]
}
