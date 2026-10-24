import type { Payload, PayloadRequest } from 'payload'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'

/** Unpaid reservations are released after this many hours. */
export const HOLD_HOURS = 72
const SWEEP_INTERVAL_MS = 10 * 60 * 1000

const drizzle = (payload: Payload) => (payload.db as unknown as PostgresAdapter).drizzle
const idList = (ids: number[]) =>
  sql.join(
    ids.map((id) => sql`${id}`),
    sql`, `,
  )

/**
 * Atomically moves instruments from `available` to `reserved`. Returns the ids that were claimed;
 * if another buyer got there first, fewer ids come back.
 */
export async function claimInstruments(payload: Payload, ids: number[]): Promise<number[]> {
  if (ids.length === 0) return []
  const result = await drizzle(payload).execute(
    sql`UPDATE "instruments" SET "status" = 'reserved', "updated_at" = now()
        WHERE "id" IN (${idList(ids)}) AND "status" = 'available' RETURNING "id"`,
  )
  return ((result as unknown as { rows?: { id: number }[] }).rows ?? []).map((r) => Number(r.id))
}

/**
 * Moves instruments that are still `reserved` back to `available`, unless another open order
 * (other than `exceptOrderId`) still holds them. Sold ones are left alone.
 */
export async function releaseInstruments(
  payload: Payload,
  ids: number[],
  exceptOrderId: number | null = null,
): Promise<number> {
  if (ids.length === 0) return 0
  const result = await drizzle(payload).execute(
    sql`UPDATE "instruments" SET "status" = 'available', "updated_at" = now()
        WHERE "id" IN (${idList(ids)}) AND "status" = 'reserved'
          AND NOT EXISTS (
            SELECT 1 FROM "orders_items" oi JOIN "orders" o ON o."id" = oi."_parent_id"
            WHERE oi."instrument_id" = "instruments"."id"
              AND o."status" IN ('pending_payment', 'paid', 'processing', 'shipped')
              AND o."id" IS DISTINCT FROM ${exceptOrderId}
          )
        RETURNING "id"`,
  )
  return ((result as unknown as { rows?: unknown[] }).rows ?? []).length
}

/** Error summary safe for logs: DB errors embed query parameters (customer data) in `message`. */
export function errorSummary(error: unknown): string {
  if (!(error instanceof Error)) return 'unknown error'
  const cause = error.cause as { code?: string } | undefined
  const code = (error as { code?: string }).code ?? cause?.code
  return code ? `${error.name} (${code})` : error.name
}

/**
 * Cancels unpaid reservations older than HOLD_HOURS. The orders `afterChange` hook releases the
 * instruments when an order becomes cancelled.
 */
export async function releaseExpiredHolds(payload: Payload, req?: PayloadRequest): Promise<number> {
  const cutoff = new Date(Date.now() - HOLD_HOURS * 60 * 60 * 1000).toISOString()
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [{ status: { equals: 'pending_payment' } }, { createdAt: { less_than: cutoff } }],
    },
    limit: 50,
    depth: 0,
    req,
  })
  let cancelled = 0
  for (const order of docs) {
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
    try {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: 'cancelled',
          notes: `${order.notes ? `${order.notes}\n` : ''}[${stamp} UTC] Auto-cancelled: unpaid after ${HOLD_HOURS} hours.`,
        },
        req,
      })
      cancelled += 1
    } catch (error) {
      console.error(`holds: sweep failed for ${order.orderNumber}: ${errorSummary(error)}`)
    }
  }
  if (cancelled > 0) {
    console.log(`holds: auto-cancelled ${cancelled} expired reservation(s)`)
  }
  return cancelled
}

let lastSweep = 0
let running: Promise<unknown> | null = null

/**
 * Runs `releaseExpiredHolds` at most once every 10 minutes, in the background. Triggered by
 * instrument reads (gallery, product pages) and by new reservations, so expired holds disappear
 * as soon as anyone looks at the catalogue.
 */
export function scheduleHoldSweep(payload: Payload) {
  const now = Date.now()
  if (running || now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  running = releaseExpiredHolds(payload)
    .catch((error) => console.error(`holds: sweep failed: ${errorSummary(error)}`))
    .finally(() => {
      running = null
    })
}
