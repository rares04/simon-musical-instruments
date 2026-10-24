import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Pages of the pre-2025 static site. Other sites still link to them (www and apex).
// Destinations are absolute: the middleware skips paths with a dot, so it can't fix the host.
const SITE = 'https://simoninstruments.com'
const LEGACY_LOCALES = ['en', 'ro', 'de', 'fr', 'nl']
const LEGACY_PAGES = {
  'home.html': '',
  'about-us.html': '',
  'galery.html': '/gallery',
  'contact.html': '/contact',
}
const legacyRedirects = [
  { source: '/index.html', destination: `${SITE}/`, permanent: true },
  ...LEGACY_LOCALES.flatMap((locale) =>
    Object.entries(LEGACY_PAGES).map(([file, path]) => ({
      source: `/${locale}/${file}`,
      destination: `${SITE}/${locale}${path}`,
      permanent: true,
    })),
  ),
]

// Security headers (see SECURITY.md). The CSP starts in report-only mode: violations are sent to
// /api/csp-report and logged, and nothing is blocked until the reports are clean.
const CSP = [
  "default-src 'self'",
  // Next.js inlines hydration scripts; Turnstile and PostHog load their own scripts.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://eu-assets.i.posthog.com",
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

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=15552000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Content-Security-Policy-Report-Only', value: CSP },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // The commit being built, sent with browser analytics as `app_version`. Railway sets
  // RAILWAY_GIT_COMMIT_SHA in GitHub-triggered builds; a ${{...}} reference to it resolves empty.
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.NEXT_PUBLIC_APP_VERSION || process.env.RAILWAY_GIT_COMMIT_SHA || '',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return legacyRedirects
  },
  // Next 16 `next dev` otherwise appends a generated block to AGENTS.md (our handbook).
  agentRules: false,
  images: {
    // Media is served same-origin from /api/media/file/*. Don't allow remote hosts: the optimizer
    // would fetch and process images from them. The OAuth avatar is rendered `unoptimized`.
    remotePatterns: [],
    // Next 16: only these local paths may be optimized (and with query strings, e.g. cache-busted
    // media URLs), and only these quality values (one component uses 100).
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/gallery/**' },
      { pathname: '/placeholder.svg' },
    ],
    qualities: [75, 100],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
