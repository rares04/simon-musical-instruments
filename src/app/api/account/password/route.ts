import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LIMITS, rateLimit, tooManyRequests } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { limit, windowMs } = LIMITS.passwordChange
    const allowed = rateLimit(`passwordChange:${session.user.id}`, limit, windowMs)
    if (!allowed.ok) return tooManyRequests(allowed.retryAfterSec)

    const body = await req.json().catch(() => ({}))
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 },
      )
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const user = await payload.findByID({ collection: 'users', id: session.user.id, depth: 0 })

    // Payload stores a salted hash; verify the current password through its own login check.
    // Accounts linked to Google keep working here if the user knows their password.
    try {
      await payload.login({
        collection: 'users',
        data: { email: user.email, password: currentPassword },
      })
    } catch {
      const error =
        user.provider === 'google'
          ? 'Cannot change password for OAuth-authenticated accounts'
          : 'Current password is incorrect'
      return NextResponse.json({ error }, { status: 400 })
    }

    // Payload hashes the new password itself.
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { password: newPassword },
    })

    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
