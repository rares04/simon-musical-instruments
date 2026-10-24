import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import type { Instrument } from '@/payload-types'
import { dedupe, indexNowKey, instrumentChangeUrls, submitIndexNow } from '@/lib/seo/indexnow'

/**
 * Pings IndexNow when an instrument is created, changed or deleted. Fire-and-forget: it never
 * delays or fails a save. Production only (see `indexNowKey`).
 * Bulk scripts pass `context: { skipIndexNow: true }`.
 */
function ping(req: PayloadRequest, urls: string[]): void {
  const key = indexNowKey()
  if (!key) return
  const fresh = dedupe(urls)
  if (fresh.length === 0) return
  void submitIndexNow(fresh, { key }).then((status) => {
    // 200 and 202 mean accepted.
    if (status !== 200 && status !== 202) {
      req.payload.logger.warn({ msg: 'IndexNow ping not accepted', status, urls: fresh.length })
    }
  })
}

export const indexNowAfterChange: CollectionAfterChangeHook<Instrument> = ({
  doc,
  previousDoc,
  context,
  req,
}) => {
  if (!context?.skipIndexNow) ping(req, instrumentChangeUrls(doc, previousDoc))
  return doc
}

export const indexNowAfterDelete: CollectionAfterDeleteHook<Instrument> = ({
  doc,
  context,
  req,
}) => {
  if (!context?.skipIndexNow) ping(req, instrumentChangeUrls(doc))
}
