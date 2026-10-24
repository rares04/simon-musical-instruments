import 'server-only'
import { NextResponse } from 'next/server'
import { clientIp } from '@/lib/rate-limit'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Turnstile is enforced only when both keys are configured. The site key is inlined at build time,
 * so this matches what the pages actually render: a secret without a site key would otherwise
 * reject every form, and the env check warns about any half-configured state.
 */
export const turnstileEnabled = () =>
  Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

/**
 * Verifies a Cloudflare Turnstile token. Fails closed when Turnstile is configured: a missing or
 * invalid token, or an unreachable verification endpoint, rejects the request.
 */
export async function verifyTurnstile(token: unknown, req: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !turnstileEnabled()) return true // Not configured (local development).
  if (typeof token !== 'string' || !token || token.length > 2048) return false

  const body = new URLSearchParams({ secret, response: token, remoteip: clientIp(req) })
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      console.warn('turnstile: rejected', data['error-codes']?.join(',') ?? '')
    }
    return data.success === true
  } catch (error) {
    console.error('turnstile: verification failed', error instanceof Error ? error.message : error)
    return false
  }
}

export function captchaFailed() {
  return NextResponse.json(
    { error: 'Security check failed. Please try again.', captcha: true },
    { status: 400 },
  )
}
