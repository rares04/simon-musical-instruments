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

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return legacyRedirects
  },
  images: {
    // Media is served same-origin from /api/media/file/*. Don't allow remote hosts: the optimizer
    // would fetch and process images from them. The OAuth avatar is rendered `unoptimized`.
    remotePatterns: [],
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
