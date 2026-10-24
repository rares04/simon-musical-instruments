import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { hasAdminRole } from '@/access'
import { limitByIp } from '@/lib/rate-limit'
import { captchaFailed, verifyTurnstile } from '@/lib/turnstile'
import {
  OTP_MAX_ATTEMPTS,
  formatOtpRecord,
  otpMatches,
  parseOtpRecord,
  swapOtp,
} from '@/lib/otp'

// One answer for every failure, so responses don't reveal account state.
const INVALID = {
  error: 'Invalid or expired reset code. You can request a new code.',
}

/**
 * Step 2 of the storefront password reset: checks the emailed code (5 attempts, each taken
 * atomically before the check) and sets the new password.
 */
export async function POST(request: Request) {
  try {
    const limited = limitByIp(request, 'passwordResetConfirm')
    if (limited) return limited

    const body = await request.json().catch(() => ({}))
    // Each attempt needs a bot check, so nobody can burn through a victim's code attempts.
    if (!(await verifyTurnstile(body.turnstileToken, request))) return captchaFailed()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const code = typeof body.code === 'string' ? body.code : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(INVALID, { status: 400 })
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Password must be 8 to 128 characters', field: 'password' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    const user = docs[0]
    const record = parseOtpRecord(user?.otp, 'reset')

    if (!user || hasAdminRole(user) || !record?.hash || !user.otpExpiry) {
      return NextResponse.json(INVALID, { status: 400 })
    }

    const stored = user.otp as string
    const discarded = formatOtpRecord({ ...record, hash: null }, 'reset')

    if (new Date(user.otpExpiry) < new Date() || record.attempts >= OTP_MAX_ATTEMPTS) {
      await swapOtp(payload, user.id, stored, discarded)
      return NextResponse.json(INVALID, { status: 400 })
    }

    // Use up one attempt atomically before checking the code.
    const attempts = record.attempts + 1
    const consumed = formatOtpRecord({ ...record, attempts }, 'reset')
    if (!(await swapOtp(payload, user.id, stored, consumed))) {
      return NextResponse.json(INVALID, { status: 400 })
    }

    if (!otpMatches(user.id, code, record.hash, 'reset')) {
      if (attempts >= OTP_MAX_ATTEMPTS) {
        await swapOtp(
          payload,
          user.id,
          consumed,
          formatOtpRecord({ ...record, attempts, hash: null }, 'reset'),
        )
      }
      return NextResponse.json(INVALID, { status: 400 })
    }

    // The code proves control of the address. Payload hashes the new password itself.
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { password, emailVerified: true, otp: null, otpExpiry: null },
    })
    // Clear any login lockout from earlier failed attempts (as Payload's own unlock does).
    await payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { loginAttempts: 0, lockUntil: null },
      returning: false,
    })

    return NextResponse.json({ success: true, message: 'Password updated. Please sign in.' })
  } catch (error) {
    console.error('reset-password error:', error instanceof Error ? error.name : 'unknown error')
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
