import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendEmail } from '@/lib/resend'
import { OtpVerificationEmail } from '@/lib/emails/otp-verification'

// Generate a 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP expires in 10 minutes
const OTP_EXPIRY_MINUTES = 10

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, locale = 'en' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
      limit: 1,
    })

    if (users.docs.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a verification code has been sent.',
      })
    }

    const user = users.docs[0]

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          error: 'Email is already verified',
          alreadyVerified: true,
        },
        { status: 400 },
      )
    }

    // Check if user registered via OAuth (Google) - no OTP needed
    if (user.provider && user.provider !== 'credentials') {
      return NextResponse.json(
        {
          error: 'OAuth users do not need email verification',
          isOAuth: true,
        },
        { status: 400 },
      )
    }

    // Generate OTP
    const otp = generateOtp()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    // Update user with OTP
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        otp,
        otpExpiry: otpExpiry.toISOString(),
      },
    })

    const subjects: Record<string, string> = {
      en: 'Verify your email - Simon Musical Instruments',
      ro: 'Verifică-ți adresa de email - Simon Musical Instruments',
      de: 'E-Mail verifizieren - Simon Musical Instruments',
      fr: 'Vérifiez votre e-mail - Simon Musical Instruments',
      nl: 'E-mail verifiëren - Simon Musical Instruments',
      el: 'Επαληθεύστε το email σας - Simon Musical Instruments',
      ja: 'メールアドレスの確認 - Simon Musical Instruments',
      ko: '이메일 인증 - Simon Musical Instruments',
    }

    // Send OTP email
    const emailResult = await sendEmail({
      to: email,
      subject: subjects[locale] || subjects.en,
      react: OtpVerificationEmail({
        firstName: user.firstName || user.name?.split(' ')[0] || undefined,
        otp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
        locale,
      }),
    })

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiryMinutes: OTP_EXPIRY_MINUTES,
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending the verification code' },
      { status: 500 },
    )
  }
}
