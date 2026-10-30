import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { securityHeaders } from './security-headers.mjs'

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

// Security headers, including the enforced CSP: see security-headers.mjs.
const headers = securityHeaders(process.env.NODE_ENV)

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
    return [{ source: '/:path*', headers }]
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
