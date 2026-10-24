/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// Security wrappers added below. Keep them if this file is ever regenerated.
import config from '@payload-config'
import '@payloadcms/next/css'
import { getPayload } from 'payload'
import { hasAdminRole } from '@/access'
import { limitByIp } from '@/lib/rate-limit'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

type RouteContext = { params: Promise<{ slug?: string[] }> }

/**
 * The endpoint path as Payload routes it: the decoded slug segments, lowercased (Payload matches
 * endpoint paths case-insensitively), e.g. "users/login".
 */
async function endpointPath(ctx: RouteContext): Promise<string> {
  const { slug } = await ctx.params
  return (slug ?? []).join('/').toLowerCase()
}

// Only admins may send query filters (`where`, `joins`) to the REST API. The storefront reads data
// through the Local API and never needs them; restricting them limits the query surface that
// untrusted visitors can reach. Payload also accepts queries in a POST body with a method-override
// header, so that path is covered too.
const FILTER_PARAM = /^(where|joins)(\[|$)/
const usesQueryFilters = (req: Request) =>
  [...new URL(req.url).searchParams.keys()].some((key) => FILTER_PARAM.test(key))
const isMethodOverride = (req: Request) =>
  Boolean(
    req.headers.get('x-payload-http-method-override') || req.headers.get('x-http-method-override'),
  )
async function isAdminRequest(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  return hasAdminRole(user)
}
const forbidden = () =>
  Response.json({ errors: [{ message: 'Query filters are not allowed.' }] }, { status: 403 })
const notFound = () => Response.json({ errors: [{ message: 'Not found' }] }, { status: 404 })

// Payload's auth endpoints are rate-limited per IP.
const AUTH_ENDPOINTS = new Set(['users/login', 'users/first-register', 'users/unlock'])
// Payload has no email adapter, so its own forgot/reset flow can't deliver mail. Customers use
// /forgot-password; admin passwords are set by another admin in /admin.
const DISABLED_ENDPOINTS = new Set(['users/forgot-password', 'users/reset-password'])

const restGet = REST_GET(config)
export const GET: typeof restGet = async (req, ctx) => {
  if (usesQueryFilters(req) && !(await isAdminRequest(req))) return forbidden()
  return restGet(req, ctx)
}

const restPost = REST_POST(config)
export const POST: typeof restPost = async (req, ctx) => {
  const path = await endpointPath(ctx)
  if (DISABLED_ENDPOINTS.has(path)) return notFound()
  if ((isMethodOverride(req) || usesQueryFilters(req)) && !(await isAdminRequest(req))) {
    return forbidden()
  }
  if (AUTH_ENDPOINTS.has(path)) {
    const limited = limitByIp(req, 'adminAuth')
    if (limited) return limited
  }
  return restPost(req, ctx)
}

// Bulk update and delete also accept `where`.
const restDelete = REST_DELETE(config)
export const DELETE: typeof restDelete = async (req, ctx) => {
  if (usesQueryFilters(req) && !(await isAdminRequest(req))) return forbidden()
  return restDelete(req, ctx)
}
const restPatch = REST_PATCH(config)
export const PATCH: typeof restPatch = async (req, ctx) => {
  if (usesQueryFilters(req) && !(await isAdminRequest(req))) return forbidden()
  return restPatch(req, ctx)
}
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
