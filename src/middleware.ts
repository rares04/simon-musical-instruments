import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/**
 * Middleware that handles URL canonicalization for SEO:
 * 1. WWW to non-WWW redirect (301)
 * 2. Trailing slash removal for sub-pages (301)
 * 3. Internationalization routing via next-intl
 *
 * All canonicalization is done in a single redirect to avoid redirect chains.
 */
export default function middleware(request: NextRequest) {
  const url = new URL(request.url)

  // Get the host from headers (handle proxies like Railway's load balancer)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host') || ''

  // Get the protocol (default to https in production)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const protocol = forwardedProto || 'https'

  // Track if we need to redirect
  let needsRedirect = false
  let canonicalHost = host
  let canonicalPath = url.pathname

  // 1. Non-WWW Enforcement
  // If host starts with "www.", remove it
  if (host.startsWith('www.')) {
    canonicalHost = host.replace(/^www\./, '')
    needsRedirect = true
  }

  // 2. Trailing Slash Removal (for sub-pages only)
  // Remove trailing slash if:
  // - Path ends with "/"
  // - Path is not the root "/"
  // - Path doesn't look like a file (no extension)
  // Note: API routes are already excluded by the matcher config
  if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
    canonicalPath = canonicalPath.slice(0, -1)
    needsRedirect = true
  }

  // If any canonicalization is needed, redirect with 301
  if (needsRedirect) {
    const canonicalUrl = `${protocol}://${canonicalHost}${canonicalPath}${url.search}`

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
