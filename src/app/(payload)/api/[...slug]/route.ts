/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { limitByIp } from '@/lib/rate-limit'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
// Security: rate-limit Payload's auth endpoints per IP. Keep this wrapper if the file is regenerated.
const restPost = REST_POST(config)
const AUTH_PATHS = /^\/api\/users\/(login|forgot-password|reset-password|first-register|unlock)$/
export const POST: typeof restPost = async (req, ctx) => {
  if (AUTH_PATHS.test(new URL(req.url).pathname)) {
    const limited = limitByIp(req, 'adminAuth')
    if (limited) return limited
  }
  return restPost(req, ctx)
}
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
