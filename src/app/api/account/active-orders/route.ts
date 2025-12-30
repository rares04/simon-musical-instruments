import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const userId = session.user.id
    const userEmail = session.user.email

    // Fetch active orders (not delivered, cancelled, or refunded)
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        and: [
          {
            or: [{ customer: { equals: userId } }, { guestEmail: { equals: userEmail } }],
          },
          {
            status: {
              not_in: ['delivered', 'cancelled', 'refunded'],
            },
          },
        ],
      },
      sort: '-createdAt',
      limit: 10,
      depth: 1,
    })

    // Transform orders for the dropdown
    const activeOrders = orders.map((order) => {
      const firstItem = order.items?.[0]
      return {
        id: order.orderNumber,
        status: order.status,
        itemName: firstItem?.title || 'Instrument',
        total: order.total,
        createdAt: order.createdAt,
      }
    })

    // Sort to prioritize pending_payment orders
    activeOrders.sort((a, b) => {
      if (a.status === 'pending_payment' && b.status !== 'pending_payment') return -1
      if (a.status !== 'pending_payment' && b.status === 'pending_payment') return 1
      return 0
    })

    return NextResponse.json({
      orders: activeOrders,
      hasPendingPayment: activeOrders.some((o) => o.status === 'pending_payment'),
      count: activeOrders.length,
    })
  } catch (error) {
    console.error('Error fetching active orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
