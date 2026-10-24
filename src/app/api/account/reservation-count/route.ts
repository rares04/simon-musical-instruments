import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { customerOrdersWhere } from '@/lib/order-access'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const RESERVATION_LIMIT = 2

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        count: 0,
        limit: RESERVATION_LIMIT,
        pendingReservations: [],
      })
    }

    const payload = await getPayload({ config })
    const ownOrders = await customerOrdersWhere(payload, session.user.id)
    if (!ownOrders) {
      return NextResponse.json({
        count: 0,
        limit: RESERVATION_LIMIT,
        pendingReservations: [],
      })
    }

    // Query for pending_payment orders
    const { docs: pendingOrders } = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { status: { equals: 'pending_payment' } },
          ownOrders,
        ],
      },
      sort: '-createdAt',
      depth: 1,
    })

    // Format pending reservations for response
    const pendingReservations = pendingOrders.map((order) => {
      const firstItem = order.items?.[0]
      return {
        id: order.orderNumber,
        name: firstItem?.title || 'Instrument',
        date: order.createdAt,
        price: order.total,
      }
    })

    return NextResponse.json({
      count: pendingOrders.length,
      limit: RESERVATION_LIMIT,
      pendingReservations,
    })
  } catch (error) {
    console.error('Error fetching reservation count:', error)
    return NextResponse.json({ error: 'Failed to fetch reservation count' }, { status: 500 })
  }
}
