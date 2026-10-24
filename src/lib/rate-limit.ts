import 'server-only'
import { NextResponse } from 'next/server'

/**
 * In-process fixed-window rate limiter. The app runs as a single Railway replica, so memory is
 * shared by every request; counters reset on deploy, which is acceptable for abuse protection.
 */
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()
let lastSweep = 0

function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key)
}

/**
 * Client IP as set by Railway's edge, which overwrites `X-Real-IP` on every public request.
 * Falls back to the first `X-Forwarded-For` entry, then to a shared "unknown" bucket.
 */
export function clientIp(req: Request): string {
  const real = req.headers.get('x-real-ip')?.trim()
  if (real) return real
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || 'unknown'
}

/** 203.0.113.42 → 203.0.113.x; IPv6 keeps the first three groups. */
export function maskIp(ip: string): string {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ip.replace(/\.\d+$/, '.x')
  if (ip.includes(':')) return `${ip.split(':').slice(0, 3).join(':')}:…`
  return ip
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  sweep(now)
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true as const, retryAfterSec: 0 }
  }
  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false as const, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { ok: true as const, retryAfterSec: 0 }
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
  )
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

/** Per-IP limits for public endpoints. */
export const LIMITS = {
  register: { limit: 5, windowMs: HOUR },
  contact: { limit: 5, windowMs: HOUR },
  reservation: { limit: 10, windowMs: HOUR },
  sendOtp: { limit: 5, windowMs: 10 * MINUTE },
  verifyOtp: { limit: 20, windowMs: 10 * MINUTE },
  checkVerification: { limit: 10, windowMs: 10 * MINUTE },
  login: { limit: 10, windowMs: 10 * MINUTE },
  adminAuth: { limit: 10, windowMs: 10 * MINUTE },
  passwordChange: { limit: 5, windowMs: 10 * MINUTE },
  passwordResetRequest: { limit: 5, windowMs: HOUR },
  passwordResetConfirm: { limit: 20, windowMs: 10 * MINUTE },
} as const

/** Returns a 429 response if `req` is over the named limit, otherwise null. */
export function limitByIp(req: Request, name: keyof typeof LIMITS) {
  const { limit, windowMs } = LIMITS[name]
  const ip = clientIp(req)
  const result = rateLimit(`${name}:${ip}`, limit, windowMs)
  if (result.ok) return null
  // Security log: which network hit which limit (masked IP, no body, no identity).
  console.warn(`rate-limit: ${name} blocked for ${maskIp(ip)}`)
  return tooManyRequests(result.retryAfterSec)
}
