import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { Download, Package, Truck, MapPin, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

// Helper to get image URL from Payload media
function getImageUrl(image: number | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'number') return null
  return image.url || null
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders')
  }

  const payload = await getPayload({ config })

  // Find order by orderNumber
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { orderNumber: { equals: id } },
        {
          or: [
            { customer: { equals: session.user.id } },
            { guestEmail: { equals: session.user.email } },
          ],
        },
      ],
    },
    limit: 1,
    depth: 2,
  })

  const order = docs[0]

  if (!order) {
    notFound()
  }

  // Build timeline based on order status
  const timeline = [
    {
      status: 'Order Placed',
      date: new Date(order.paidAt || order.createdAt).toLocaleDateString(),
      completed: true,
    },
    {
      status: 'Processing',
      date: order.status === 'paid' ? 'Pending' : new Date(order.createdAt).toLocaleDateString(),
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'Shipped',
      date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : 'Pending',
      completed: ['shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'Delivered',
      date: order.status === 'delivered' ? 'Completed' : 'Pending',
      completed: order.status === 'delivered',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Order Details
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-mono text-lg text-muted-foreground">{order.orderNumber}</p>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <Button className="cursor-pointer" asChild>
          <Link href={`/api/orders/${order.id}/invoice`}>
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Link>
        </Button>
      </div>

      {/* Order Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-semibold text-foreground mb-6">Order Timeline</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="relative flex items-start gap-4 pl-10">
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    event.completed ? 'bg-accent border-accent' : 'bg-background border-border'
                  }`}
                >
                  {event.completed && <div className="w-3 h-3 bg-background rounded-full" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <p
                    className={`font-semibold ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {event.status}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const instrument = typeof item.instrument === 'object' ? item.instrument : null
                const imageUrl = instrument ? getImageUrl(instrument.mainImage) : null

                return (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {instrument && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {instrument.instrumentType} · {instrument.year}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                        <p className="font-semibold text-foreground">
                          €{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipping Info */}
          {order.trackingNumber && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <p className="font-mono text-foreground">{order.trackingNumber}</p>
                </div>
                {order.trackingUrl && (
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                    asChild
                  >
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      Track Package
                    </a>
                  </Button>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="text-foreground">{order.estimatedDelivery}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">€{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">€{order.shipping}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Insurance</span>
                <span className="text-foreground">€{order.insurance}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  €{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="text-sm text-foreground space-y-1">
              <p className="font-medium">
                {order.contactInfo?.firstName} {order.contactInfo?.lastName}
              </p>
              <p>{order.shippingAddress?.street}</p>
              {order.shippingAddress?.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.zip}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </h2>
            <p className="text-sm text-foreground">Stripe Payment</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {order.paymentIntentId}</p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button asChild variant="outline" className="cursor-pointer bg-transparent">
        <Link href="/account/orders">Back to Orders</Link>
      </Button>
    </div>
  )
}
