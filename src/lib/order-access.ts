import 'server-only'
import type { Payload, Where } from 'payload'
import type { Order, User } from '@/payload-types'

/**
 * Which orders a signed-in customer may see: orders linked to their account, plus guest orders
 * placed with their email, but only once that email has been verified (OTP or Google).
 * Identity is read from the database, not from the session token.
 */
export async function customerOrdersWhere(
  payload: Payload,
  userId: string | number,
): Promise<Where | null> {
  let user: User | null = null
  try {
    user = await payload.findByID({ collection: 'users', id: userId, depth: 0 })
  } catch {
    return null
  }
  if (!user) return null

  const emailTrusted = Boolean(user.emailVerified) || user.provider === 'google'
  return {
    or: [
      { customer: { equals: user.id } },
      ...(emailTrusted && user.email ? [{ guestEmail: { equals: user.email } }] : []),
    ],
  }
}

/** Removes fields that are internal to the shop before an order is sent to a customer. */
export function toCustomerOrder<T extends Partial<Order>>(order: T): Omit<T, 'notes'> {
  const { notes: _internal, ...rest } = order
  return rest
}
