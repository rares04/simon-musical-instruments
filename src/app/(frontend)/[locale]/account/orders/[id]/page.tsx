import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import {
  Download,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Building2,
  Clock,
  AlertCircle,
} from 'lucide-react'
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

  const isReservation = order.status === 'pending_payment'
  const isPickup = order.deliveryMethod === 'pickup'

  // Build timeline based on order status and type
  const timeline = isReservation
    ? [
        {
          status: 'Reservation Placed',
          date: new Date(order.createdAt).toLocaleDateString(),
          completed: true,
        },
        {
          status: 'Awaiting Contact',
          date: 'Paul will contact you within 1-2 business days',
          completed: false,
          current: true,
        },
        {
          status: 'Payment Arranged',
          date: 'Bank transfer or cash on pickup',
          completed: false,
        },
        {
          status: isPickup ? 'Ready for Pickup' : 'Shipped',
          date: 'Pending',
          completed: false,
        },
      ]
    : [
        {
          status: 'Order Placed',
          date: new Date(order.paidAt || order.createdAt).toLocaleDateString(),
          completed: true,
        },
        {
          status: 'Processing',
          date:
            order.status === 'paid' ? 'Pending' : new Date(order.createdAt).toLocaleDateString(),
          completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        },
        {
          status: isPickup ? 'Ready for Pickup' : 'Shipped',
          date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : 'Pending',
          completed: ['shipped', 'delivered'].includes(order.status),
        },
        {
          status: isPickup ? 'Picked Up' : 'Delivered',
          date: order.status === 'delivered' ? 'Completed' : 'Pending',
          completed: order.status === 'delivered',
        },
      ]

  return (
    <div className="space-y-8">
      {/* Pending Payment Alert */}
      {isReservation && (
        <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Reservation Awaiting Payment</h3>
              <p className="text-sm text-muted-foreground">
                Paul will contact you within 1-2 business days to arrange payment via bank transfer
                {isPickup ? ' or cash on pickup' : ''}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {isReservation ? 'Reservation Details' : 'Order Details'}
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-mono text-lg text-muted-foreground">{order.orderNumber}</p>
            <OrderStatusBadge status={order.status} showIcon />
          </div>
        </div>
        {!isReservation && (
          <Button className="cursor-pointer" asChild>
            <Link href={`/api/orders/${order.id}/invoice`}>
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Link>
          </Button>
        )}
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
                          {instrument.instrumentType}
                          {instrument.model && ` · ${instrument.model}`}
                          {instrument.year && ` · ${instrument.year}`}
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
            <h2 className="font-semibold text-foreground mb-4">
              {isReservation ? 'Reservation Summary' : 'Order Summary'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">€{order.subtotal.toLocaleString()}</span>
              </div>
              {!isPickup && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-green-600">Included</span>
                  </div>
                </>
              )}
              {isPickup && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="text-green-600">Free</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  €{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Address */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              {isPickup ? <Building2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              {isPickup ? 'Pickup Location' : 'Delivery Address'}
            </h2>
            {isPickup ? (
              <div className="text-sm text-foreground space-y-1">
                <p className="font-medium">Simon Musical Instruments Atelier</p>
                <p>Strada 1 Decembrie 1918, nr. 8</p>
                <p>Reghin, Mureș 545300</p>
                <p>Romania</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Paul will contact you to arrange a pickup time.
                </p>
              </div>
            ) : (
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
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </h2>
            {isReservation ? (
              <div className="text-sm">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Awaiting Payment</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Paul will contact you to arrange bank transfer
                  {isPickup ? ' or cash payment on pickup' : ''}.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground">
                  {order.paymentMethod === 'bank_transfer'
                    ? 'Bank Transfer'
                    : order.paymentMethod === 'cash'
                      ? 'Cash'
                      : order.paymentMethod === 'card'
                        ? 'Card Payment'
                        : 'Payment Completed'}
                </p>
                {order.paymentIntentId && (
                  <p className="text-xs text-muted-foreground mt-1">ID: {order.paymentIntentId}</p>
                )}
                {order.paymentReference && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ref: {order.paymentReference}
                  </p>
                )}
              </>
            )}
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
