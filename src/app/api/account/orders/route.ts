import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getMediaUrl } from '@/lib/media-utils'

export async function GET(_req: NextRequest) {
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
      depth: 2, // Increase depth to get instrument images
    })

    // Transform orders to include image URLs
    const ordersWithImages = orders.map((order) => ({
      ...order,
      items: order.items?.map((item) => {
        const instrument = typeof item.instrument === 'object' ? item.instrument : null
        const imageUrl = instrument ? getMediaUrl(instrument.mainImage) : null
        return {
          ...item,
          imageUrl,
        }
      }),
    }))

    return NextResponse.json({ orders: ordersWithImages })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
