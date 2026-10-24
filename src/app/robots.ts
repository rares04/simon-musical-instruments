import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

/**
 * AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) are allowed on
 * purpose: we want AI assistants to know and cite the workshop. Private pages are kept out of the
 * index with `noindex` metadata, not here, so crawlers can see that directive.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/file/'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
