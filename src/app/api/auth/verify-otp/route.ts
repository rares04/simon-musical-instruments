import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Must be 6 digits.' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 400 }
      )
    }

    const user = users.docs[0]

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Email is already verified',
      })
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    const otpExpiry = new Date(user.otpExpiry)
    if (otpExpiry < new Date()) {
      // Clear expired OTP
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          otp: null,
          otpExpiry: null,
        },
      })
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.', expired: true },
        { status: 400 }
      )
    }

    // Verify OTP
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // OTP is valid - mark email as verified and clear OTP
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'An error occurred while verifying the code' },
      { status: 500 }
    )
  }
}
