import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/** The canonical production domain (no subdomains allowed) */
const CANONICAL_DOMAIN = 'simoninstruments.com'

/**
 * Check if a host is allowed for local development
 * Matches: localhost, localhost:3000, 127.0.0.1, etc.
 */
function isLocalhost(host: string): boolean {
  const hostWithoutPort = host.split(':')[0]
  return hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1'
}

/**
 * Middleware that handles URL canonicalization for SEO:
 * 1. Strict domain enforcement - redirects ALL subdomains to canonical domain (301)
 * 2. Trailing slash removal for sub-pages (301)
 * 3. Internationalization routing via next-intl
 *
 * Wildcard domain setup: *.simoninstruments.com → simoninstruments.com
 * All canonicalization is done in a single redirect to avoid redirect chains.
 */
export default function middleware(request: NextRequest) {
  const url = new URL(request.url)

  // Get the host from headers (handle proxies like Railway's load balancer)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host') || ''

  // Extract hostname without port for comparison
  const hostWithoutPort = host.split(':')[0]

  // Get the protocol (default to https in production)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const protocol = forwardedProto || 'https'

  // Track if we need to redirect
  let needsRedirect = false
  let canonicalPath = url.pathname

  // 1. Strict Domain Enforcement
  // If host is NOT exactly the canonical domain (and not localhost for dev),
  // redirect to the canonical domain. This catches www., api., random., etc.
  const isCanonicalDomain = hostWithoutPort === CANONICAL_DOMAIN
  const isDevelopment = isLocalhost(host)

  if (!isCanonicalDomain && !isDevelopment) {
    needsRedirect = true
  }

  // 2. Trailing Slash Removal (for sub-pages only)
  // Remove trailing slash if:
  // - Path ends with "/"
  // - Path is not the root "/"
  // Note: API routes are already excluded by the matcher config
  if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
    canonicalPath = canonicalPath.slice(0, -1)
    needsRedirect = true
  }

  // If any canonicalization is needed, redirect with 301
  if (needsRedirect) {
    // Always redirect to the canonical domain in production
    const targetHost = isDevelopment ? host : CANONICAL_DOMAIN
    const targetProtocol = isDevelopment ? 'http' : protocol
    const canonicalUrl = `${targetProtocol}://${targetHost}${canonicalPath}${url.search}`

    return NextResponse.redirect(canonicalUrl, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  // Continue with i18n middleware for canonical requests
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for:
  // - /api (API routes)
  // - /admin (Payload admin)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /.*\\..* (files with extensions like .jpg, .css, etc.)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)', '/'],
}
