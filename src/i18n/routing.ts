import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale in URL (e.g., /en/shop, /de/shop)
  localePrefix: 'always',
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
