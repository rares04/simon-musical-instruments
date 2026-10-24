import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const user = await payload.findByID({
      collection: 'users',
      id: session.user.id,
      depth: 0,
    })

    // Return safe user data
    return NextResponse.json({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      savedAddresses: user.savedAddresses || [],
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const field = (v: unknown, max: number) =>
      typeof v === 'string' ? v.trim().slice(0, max) : undefined

    const payload = await getPayload({ config })

    // The email address can't be changed here: it identifies the account and its guest orders.
    const updatedUser = await payload.update({
      collection: 'users',
      id: session.user.id,
      data: {
        firstName: field(body.firstName, 100),
        lastName: field(body.lastName, 100),
        phone: field(body.phone, 40),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
