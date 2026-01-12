import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ needsVerification: false })
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
      // User doesn't exist
      return NextResponse.json({ needsVerification: false })
    }

    const user = users.docs[0]

    // Check if it's a credentials user with unverified email
    if (user.provider === 'credentials' && !user.emailVerified) {
      return NextResponse.json({ needsVerification: true })
    }

    return NextResponse.json({ needsVerification: false })
  } catch (error) {
    console.error('Error checking verification status:', error)
    return NextResponse.json({ needsVerification: false })
  }
}
