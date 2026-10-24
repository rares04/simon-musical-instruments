import { NextResponse, after } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { hasAdminRole } from '@/access'
import { sendEmail } from '@/lib/resend'
import { OtpVerificationEmail } from '@/lib/emails/otp-verification'
import { limitByIp } from '@/lib/rate-limit'
import { captchaFailed, verifyTurnstile } from '@/lib/turnstile'
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
  en: 'Reset your password - Simon Musical Instruments',
  ro: 'Resetează-ți parola - Simon Musical Instruments',
  de: 'Passwort zurücksetzen - Simon Musical Instruments',
  fr: 'Réinitialisez votre mot de passe - Simon Musical Instruments',
  nl: 'Wachtwoord opnieuw instellen - Simon Musical Instruments',
  el: 'Επαναφορά κωδικού πρόσβασης - Simon Musical Instruments',
  ja: 'パスワードの再設定 - Simon Musical Instruments',
  ko: '비밀번호 재설정 - Simon Musical Instruments',
}

// Same answer in every case, so the endpoint doesn't reveal whether an account exists.
const GENERIC_OK = {
  success: true,
  message: 'If an account exists for this email, a reset code has been sent.',
  expiryMinutes: OTP_EXPIRY_MINUTES,
}

/**
 * Step 1 of the storefront password reset: emails a 6-digit code to customer accounts (verified or
 * not; the code itself proves control of the address). Admin accounts are excluded; their
 * passwords are managed in /admin.
 */
export async function POST(request: Request) {
  try {
    const limited = limitByIp(request, 'passwordResetRequest')
    if (limited) return limited

    const body = await request.json().catch(() => ({}))
    if (!(await verifyTurnstile(body.turnstileToken, request))) return captchaFailed()

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

    if (!user || hasAdminRole(user)) return NextResponse.json(GENERIC_OK)

    // One resend interval and one daily cap across verification and reset codes.
    const existing = anyOtpRecord(user.otp)
    if (existing && issuedRecently(user.otpExpiry)) return NextResponse.json(GENERIC_OK)

    const window = currentWindow(existing)
    if (window.sends >= OTP_MAX_SENDS_PER_DAY) return NextResponse.json(GENERIC_OK)

    const code = generateOtp()
    const next = formatOtpRecord(
      {
        attempts: 0,
        sends: window.sends + 1,
        windowStart: window.windowStart,
        hash: otpDigest(user.id, code, 'reset'),
      },
      'reset',
    )
    const stored = await swapOtp(
      payload,
      user.id,
      user.otp ?? null,
      next,
      otpExpiryDate().toISOString(),
    )
    if (!stored) return NextResponse.json(GENERIC_OK)

    // Send after responding, so response time doesn't depend on whether an email goes out.
    after(async () => {
      const result = await sendEmail({
        to: user.email,
        subject: SUBJECTS[locale],
        react: OtpVerificationEmail({
          firstName: user.firstName || user.name?.split(' ')[0] || undefined,
          otp: code,
          expiryMinutes: OTP_EXPIRY_MINUTES,
          locale,
          purpose: 'reset',
        }),
      })
      if (!result.success) {
        console.error('request-password-reset: email delivery failed for user', user.id)
      }
    })

    return NextResponse.json(GENERIC_OK)
  } catch (error) {
    console.error(
      'request-password-reset error:',
      error instanceof Error ? error.name : 'unknown error',
    )
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
