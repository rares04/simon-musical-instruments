import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { limitByIp } from '@/lib/rate-limit'
import {
  OTP_MAX_ATTEMPTS,
  formatOtpRecord,
  otpMatches,
  parseOtpRecord,
  swapOtp,
} from '@/lib/otp'

// One answer for every failure, so responses don't reveal account state.
const INVALID = {
  error: 'Invalid or expired verification code. You can request a new code.',
}

export async function POST(request: Request) {
  try {
    const limited = limitByIp(request, 'verifyOtp')
    if (limited) return limited

    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const otp = typeof body.otp === 'string' ? body.otp : ''

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'Invalid OTP format. Must be 6 digits.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    const user = docs[0]
    const record = parseOtpRecord(user?.otp)

    if (!user || user.emailVerified || !record?.hash || !user.otpExpiry) {
      return NextResponse.json(INVALID, { status: 400 })
    }

    const stored = user.otp as string
    // Discarded codes keep their counters and expiry, so the resend interval and daily cap hold.
    const discarded = formatOtpRecord({ ...record, hash: null })

    if (new Date(user.otpExpiry) < new Date() || record.attempts >= OTP_MAX_ATTEMPTS) {
      await swapOtp(payload, user.id, stored, discarded)
      return NextResponse.json(INVALID, { status: 400 })
    }

    // Use up one attempt atomically before checking the code, so parallel guesses can't share it.
    const attempts = record.attempts + 1
    const consumed = formatOtpRecord({ ...record, attempts })
    if (!(await swapOtp(payload, user.id, stored, consumed))) {
      return NextResponse.json(INVALID, { status: 400 })
    }

    if (!otpMatches(user.id, otp, record.hash)) {
      if (attempts >= OTP_MAX_ATTEMPTS) {
        await swapOtp(payload, user.id, consumed, formatOtpRecord({ ...record, attempts, hash: null }))
      }
      return NextResponse.json(INVALID, { status: 400 })
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { emailVerified: true, otp: null, otpExpiry: null },
    })

    return NextResponse.json({ success: true, message: 'Email verified successfully' })
  } catch (error) {
    console.error('verify-otp error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'An error occurred while verifying the code' },
      { status: 500 },
    )
  }
}
