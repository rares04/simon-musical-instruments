import type {
  Access,
  CollectionBeforeChangeHook,
  CollectionBeforeLoginHook,
  FieldAccess,
} from 'payload'
import { AuthenticationError } from 'payload'

type WithRoles = { roles?: (string | null)[] | null } | null | undefined

export const hasAdminRole = (user: unknown): boolean =>
  Boolean((user as WithRoles)?.roles?.includes('admin'))

export const anyone: Access = () => true

/**
 * Admin 2FA (payload-totp) wraps every collection's access and refuses anonymous requests. A
 * collection whose `read` is public must opt out with `custom: publicReadOptOut`, or the storefront
 * loses it (including `/api/media/file/*` for Media).
 */
export const publicReadOptOut = { totp: { disableAccessWrapper: { read: true } } }

export const isAdmin: Access = ({ req: { user } }) => hasAdminRole(user)

/** Admins see everything; other signed-in users only their own document. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasAdminRole(user)) return true
  return { id: { equals: user.id } }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => hasAdminRole(user)

/** For fields that only server code (Local API with overrideAccess) may touch. */
export const serverOnlyField: FieldAccess = () => false

/**
 * Only admins get a Payload session (`payload-token`) over REST/GraphQL.
 * Customers sign in through Auth.js, which verifies passwords with the Local API (`payloadAPI: 'local'`).
 */
export const adminOnlyApiLogin: CollectionBeforeLoginHook = ({ req, user }) => {
  if (req.payloadAPI === 'local') return user
  if (!hasAdminRole(user)) throw new AuthenticationError(req.t)
  return user
}

/**
 * The first user, created from the admin's first-register screen on an empty database, becomes an
 * admin. Storefront sign-ups go through the Local API and never get here as the first user.
 */
export const ensureFirstUserIsAdmin: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || req.payloadAPI === 'local') return data
  const { totalDocs } = await req.payload.count({ collection: 'users', req })
  if (totalDocs === 0) return { ...data, roles: ['admin'] }
  return data
}
