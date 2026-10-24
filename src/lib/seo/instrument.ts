import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Instrument } from '@/payload-types'
import { localesWithText } from './alternates'
import { CATEGORIES, sortByStatus, type CategoryKey } from './categories'
import type { Locale } from './site'

export type FoundInstrument = { instrument: Instrument; matchedBy: 'slug' | 'id' }

/**
 * Looks an instrument up by slug, then by numeric id. Cached per request, so `generateMetadata`
 * and the page share one query.
 */
export const findInstrument = cache(
  async (param: string, locale: Locale): Promise<FoundInstrument | null> => {
    const payload = await getPayload({ config })
    const bySlug = await payload.find({
      collection: 'instruments',
      locale,
      where: { slug: { equals: param } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
    if (bySlug.docs[0]) return { instrument: bySlug.docs[0], matchedBy: 'slug' }

    if (!/^\d+$/.test(param)) return null
    try {
      const instrument = await payload.findByID({
        collection: 'instruments',
        id: Number(param),
        locale,
        depth: 1,
        overrideAccess: false,
      })
      return { instrument, matchedBy: 'id' }
    } catch {
      return null
    }
  },
)

/** Locales in which this instrument's notes exist in their own language (no fallback). */
export const getTranslatedLocales = cache(async (id: number): Promise<Locale[]> => {
  const payload = await getPayload({ config })
  const doc = await payload.findByID({
    collection: 'instruments',
    id,
    locale: 'all',
    depth: 0,
    overrideAccess: false,
    select: { luthierNotes: true },
  })
  // With `locale: 'all'` the field is { en, ro, … }; the generated types don't model that.
  const notes = (doc as unknown as { luthierNotes?: Partial<Record<Locale, string | null>> })
    .luthierNotes
  return localesWithText(notes)
})

/** Every public instrument of a category, available first and sold last. Cached per request. */
export const findCategoryInstruments = cache(
  async (key: CategoryKey, locale: Locale): Promise<Instrument[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'instruments',
      locale,
      where: { instrumentType: { equals: CATEGORIES[key].type } },
      limit: 100,
      depth: 1,
      sort: '-createdAt',
      overrideAccess: false,
    })
    return sortByStatus(docs)
  },
)
