import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        or: [
          { customer: { equals: session.user.id } },
          { guestEmail: { equals: session.user.email } },
        ],
      },
      sort: '-createdAt',
      limit: 100,
      depth: 1,
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
