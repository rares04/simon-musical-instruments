import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Called by the login page after a failed sign-in. Answers `needsVerification: true` only when the
 * password is correct and the email is still unverified, so it reveals nothing to someone who
 * doesn't know the password.
 */
export async function POST(request: Request) {
  const no = NextResponse.json({ needsVerification: false })
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password || password.length > 128) return no

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    const user = docs[0]
    if (!user || user.provider !== 'credentials' || user.emailVerified) return no

    try {
      await payload.login({ collection: 'users', data: { email, password } })
    } catch {
      return no
    }
    return NextResponse.json({ needsVerification: true })
  } catch {
    return no
  }
}
