import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { errors: [{ message: 'Missing required fields' }] },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (existingUsers.totalDocs > 0) {
      return NextResponse.json(
        { errors: [{ message: 'User with this email already exists' }] },
        { status: 409 },
      )
    }

    // Create user with safe defaults
    // Note: Payload automatically hashes the password for auth collections
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
      overrideAccess: true, // Critical: Bypass access control since user is not logged in
    })

    return NextResponse.json({
      message: 'User created successfully',
      doc: { id: newUser.id, email: newUser.email }, // Return minimal info
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ errors: [{ message: 'Failed to create user' }] }, { status: 500 })
  }
}
