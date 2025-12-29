import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match only internationalized pathnames
  // Exclude: api routes, payload admin, static files, etc.
  matcher: [
    // Match all pathnames except for:
    // - /api (API routes)
    // - /admin (Payload admin)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /.*\\..* (files with extensions like .jpg, .css, etc.)
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
