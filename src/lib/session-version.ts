import 'server-only'
import { createHmac } from 'crypto'
import type { Payload } from 'payload'

/**
 * A short fingerprint of the user's current password hash. Stored in the Auth.js session token at
 * sign-in and compared on every session read, so changing or resetting the password ends every
 * other session. The hash itself never leaves the server; only an HMAC of it goes in the token.
 */
export async function passwordFingerprint(
  payload: Payload,
  userId: string | number,
): Promise<string | null> {
  const id = Number(userId)
  if (!Number.isInteger(id)) return null
  // The DB adapter returns the raw row; the Local API hides `hash`.
  const raw = (await payload.db.findOne({
    collection: 'users',
    where: { id: { equals: id } },
  })) as { hash?: string } | null
  if (!raw?.hash) return null
  const secret = process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET || ''
  return createHmac('sha256', secret).update(`pwv:${raw.hash}`).digest('hex').slice(0, 24)
}
