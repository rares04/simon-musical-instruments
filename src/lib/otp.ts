import 'server-only'
import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import type { Payload } from 'payload'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'

/** Codes are valid for 10 minutes. */
export const OTP_EXPIRY_MINUTES = 10
/** Wrong guesses allowed per code before it is discarded. */
export const OTP_MAX_ATTEMPTS = 5
/** Minimum time between two codes for the same account. */
export const OTP_RESEND_INTERVAL_MS = 60_000
/** Codes per account per rolling day. */
export const OTP_MAX_SENDS_PER_DAY = 5
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * What `users.otp` holds (never the code itself):
 *   <kind>:<attempts>:<sends in window>:<window start, ms>:<hmac of the code, or "-" when discarded>
 * `kind` is `v2` for email verification and `r2` for password reset, so a code issued for one
 * purpose can never be used for the other. Counters live in the same column (no schema change).
 */
export type OtpPurpose = 'verify' | 'reset'
const KIND: Record<OtpPurpose, string> = { verify: 'v2', reset: 'r2' }
export type OtpRecord = {
  attempts: number
  sends: number
  windowStart: number
  hash: string | null
}

export function parseOtpRecord(
  stored: string | null | undefined,
  purpose: OtpPurpose = 'verify',
): OtpRecord | null {
  const m = new RegExp(`^${KIND[purpose]}:(\\d+):(\\d+):(\\d+):([0-9a-f]{64}|-)$`).exec(stored ?? '')
  if (!m) return null
  return {
    attempts: Number(m[1]),
    sends: Number(m[2]),
    windowStart: Number(m[3]),
    hash: m[4] === '-' ? null : m[4],
  }
}

export function formatOtpRecord(r: OtpRecord, purpose: OtpPurpose = 'verify'): string {
  return `${KIND[purpose]}:${r.attempts}:${r.sends}:${r.windowStart}:${r.hash ?? '-'}`
}

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0')
}

export function otpDigest(
  userId: number | string,
  otp: string,
  purpose: OtpPurpose = 'verify',
): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  const label = purpose === 'verify' ? 'otp' : 'reset'
  return createHmac('sha256', secret).update(`${label}:${userId}:${otp}`).digest('hex')
}

export function otpMatches(
  userId: number | string,
  otp: string,
  hash: string,
  purpose: OtpPurpose = 'verify',
): boolean {
  const candidate = Buffer.from(otpDigest(userId, otp, purpose), 'hex')
  const expected = Buffer.from(hash, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
}

/** True if a code was issued less than OTP_RESEND_INTERVAL_MS ago. */
export function issuedRecently(otpExpiry: string | null | undefined): boolean {
  if (!otpExpiry) return false
  const issuedAt = new Date(otpExpiry).getTime() - OTP_EXPIRY_MINUTES * 60 * 1000
  return Date.now() - issuedAt < OTP_RESEND_INTERVAL_MS
}

/** The stored record of either kind; used so both kinds share one daily send cap. */
export function anyOtpRecord(stored: string | null | undefined): OtpRecord | null {
  return parseOtpRecord(stored, 'verify') ?? parseOtpRecord(stored, 'reset')
}

/** Send counter for the current rolling day (a new window starts after 24 h). */
export function currentWindow(r: OtpRecord | null, now = Date.now()) {
  if (r && now - r.windowStart < DAY_MS) return { sends: r.sends, windowStart: r.windowStart }
  return { sends: 0, windowStart: now }
}

/**
 * Atomically replaces `users.otp` only if it still equals `expected` (compare-and-set), so
 * concurrent requests can't reuse the same attempt. Optionally sets `otp_expiry` too.
 */
export async function swapOtp(
  payload: Payload,
  userId: number,
  expected: string | null,
  next: string | null,
  otpExpiry?: string | null,
): Promise<boolean> {
  const db = (payload.db as unknown as PostgresAdapter).drizzle
  const result =
    otpExpiry === undefined
      ? await db.execute(
          sql`UPDATE "users" SET "otp" = ${next}
              WHERE "id" = ${userId} AND "otp" IS NOT DISTINCT FROM ${expected} RETURNING "id"`,
        )
      : await db.execute(
          sql`UPDATE "users" SET "otp" = ${next}, "otp_expiry" = ${otpExpiry}
              WHERE "id" = ${userId} AND "otp" IS NOT DISTINCT FROM ${expected} RETURNING "id"`,
        )
  return ((result as { rows?: unknown[] }).rows ?? []).length === 1
}
