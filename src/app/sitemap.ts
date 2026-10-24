import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { toSitemapEntries, type SitemapInstrument } from '@/lib/seo/sitemap'

// The database isn't reachable at build time.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'instruments',
    locale: 'all',
    depth: 1,
    pagination: false,
    overrideAccess: false,
    select: { slug: true, updatedAt: true, luthierNotes: true, mainImage: true },
  })
  // `locale: 'all'` returns localized fields as { en, ro, … }; the generated types don't model that.
  return toSitemapEntries(docs as unknown as SitemapInstrument[])
}
