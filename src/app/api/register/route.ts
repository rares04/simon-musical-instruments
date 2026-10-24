import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { limitByIp } from '@/lib/rate-limit'
import { captchaFailed, verifyTurnstile } from '@/lib/turnstile'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export async function POST(req: Request) {
  try {
    const limited = limitByIp(req, 'register')
    if (limited) return limited

    const body = await req.json().catch(() => ({}))
    if (!(await verifyTurnstile(body.turnstileToken, req))) return captchaFailed()
    const email = str(body.email).toLowerCase()
    const password = typeof body.password === 'string' ? body.password : ''
    const firstName = str(body.firstName)
    const lastName = str(body.lastName)

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { errors: [{ message: 'Missing required fields' }] },
        { status: 400 },
      )
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ errors: [{ message: 'Invalid email address' }] }, { status: 400 })
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { errors: [{ message: 'Password must be 8 to 128 characters' }] },
        { status: 400 },
      )
    }
    if (firstName.length > 100 || lastName.length > 100) {
      return NextResponse.json({ errors: [{ message: 'Name is too long' }] }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })

    if (existingUsers.totalDocs > 0) {
      return NextResponse.json(
        { errors: [{ message: 'User with this email already exists' }] },
        { status: 409 },
      )
    }

    // Payload hashes the password for auth collections.
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        roles: ['user'],
        emailVerified: false,
        provider: 'credentials',
      },
      overrideAccess: true, // Not logged in yet; fields are fixed above, not taken from the body.
    })

    return NextResponse.json({
      message: 'User created successfully',
      doc: { id: newUser.id, email: newUser.email },
    })
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ errors: [{ message: 'Failed to create user' }] }, { status: 500 })
  }
}
