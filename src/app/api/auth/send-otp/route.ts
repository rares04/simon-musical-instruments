import { NextResponse, after } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { limitByIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/resend'
import { OtpVerificationEmail } from '@/lib/emails/otp-verification'
import {
  OTP_EXPIRY_MINUTES,
  OTP_MAX_SENDS_PER_DAY,
  anyOtpRecord,
  currentWindow,
  formatOtpRecord,
  generateOtp,
  issuedRecently,
  otpDigest,
  otpExpiryDate,
  swapOtp,
} from '@/lib/otp'

const SUBJECTS: Record<string, string> = {
  en: 'Verify your email - Simon Musical Instruments',
  ro: 'Verificați adresa de email - Simon Musical Instruments',
  de: 'E-Mail verifizieren - Simon Musical Instruments',
  fr: 'Vérifiez votre e-mail - Simon Musical Instruments',
  nl: 'E-mail verifiëren - Simon Musical Instruments',
  el: 'Επαληθεύστε το email σας - Simon Musical Instruments',
  ja: 'メールアドレスの確認 - Simon Musical Instruments',
  ko: '이메일 인증 - Simon Musical Instruments',
}

// Same answer in every case, so the endpoint doesn't reveal account state.
const GENERIC_OK = {
  success: true,
  message: 'If this email needs verification, a code has been sent.',
  expiryMinutes: OTP_EXPIRY_MINUTES,
}

export async function POST(request: Request) {
  try {
    const limited = limitByIp(request, 'sendOtp')
    if (limited) return limited

    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const locale = typeof body.locale === 'string' && SUBJECTS[body.locale] ? body.locale : 'en'

    if (!email || email.length > 254) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    const user = docs[0]

    // Unknown email, already verified, OAuth account, or a code was sent less than a minute ago.
    if (
      !user ||
      user.emailVerified ||
      (user.provider && user.provider !== 'credentials') ||
      issuedRecently(user.otpExpiry)
    ) {
      return NextResponse.json(GENERIC_OK)
    }

    const window = currentWindow(anyOtpRecord(user.otp))
    if (window.sends >= OTP_MAX_SENDS_PER_DAY) {
      return NextResponse.json(GENERIC_OK)
    }

    const otp = generateOtp()
    const next = formatOtpRecord({
      attempts: 0,
      sends: window.sends + 1,
      windowStart: window.windowStart,
      hash: otpDigest(user.id, otp),
    })
    // Lose the race to a concurrent request? Then that request sends the code.
    const stored = await swapOtp(
      payload,
      user.id,
      user.otp ?? null,
      next,
      otpExpiryDate().toISOString(),
    )
    if (!stored) {
      return NextResponse.json(GENERIC_OK)
    }

    // Send after responding, so response time doesn't depend on whether an email goes out.
    after(async () => {
      const emailResult = await sendEmail({
        to: user.email,
        subject: SUBJECTS[locale],
        react: OtpVerificationEmail({
          firstName: user.firstName || user.name?.split(' ')[0] || undefined,
          otp,
          expiryMinutes: OTP_EXPIRY_MINUTES,
          locale,
        }),
      })
      if (!emailResult.success) {
        console.error('send-otp: email delivery failed for user', user.id)
      }
    })

    return NextResponse.json(GENERIC_OK)
  } catch (error) {
    console.error('send-otp error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'An error occurred while sending the verification code' },
      { status: 500 },
    )
  }
}
