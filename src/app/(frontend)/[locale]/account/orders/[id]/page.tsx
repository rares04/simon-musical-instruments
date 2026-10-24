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
import { getLocale, getTranslations } from 'next-intl/server'
import { formatDate, formatPrice } from '@/lib/format'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { customerOrdersWhere } from '@/lib/order-access'
import { getMediaUrl } from '@/lib/media-utils'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  const t = await getTranslations('account.orderDetail')
  const tStatus = await getTranslations('account.orderHistory')
  const tCheckout = await getTranslations('checkout')
  const tInstruments = await getTranslations('instruments')
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders')
  }

  const payload = await getPayload({ config })
  const ownOrders = session.user.id ? await customerOrdersWhere(payload, session.user.id) : null
  if (!ownOrders) {
    notFound()
  }

  // Find order by orderNumber
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { orderNumber: { equals: id } },
        ownOrders,
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
          status: t('timeline.reservationPlaced'),
          date: formatDate(order.createdAt, locale),
          completed: true,
        },
        {
          status: t('timeline.awaitingContact'),
          date: t('timeline.awaitingContactNote'),
          completed: false,
          current: true,
        },
        {
          status: t('timeline.paymentArranged'),
          date: t('timeline.paymentArrangedNote'),
          completed: false,
        },
        {
          status: isPickup ? t('timeline.readyForPickup') : tStatus('shipped'),
          date: tStatus('pending'),
          completed: false,
        },
      ]
    : [
        {
          status: t('timeline.orderPlaced'),
          date: formatDate(order.paidAt || order.createdAt, locale),
          completed: true,
        },
        {
          status: tStatus('processing'),
          date: order.status === 'paid' ? tStatus('pending') : formatDate(order.createdAt, locale),
          completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        },
        {
          status: isPickup ? t('timeline.readyForPickup') : tStatus('shipped'),
          date: order.shippedAt ? formatDate(order.shippedAt, locale) : tStatus('pending'),
          completed: ['shipped', 'delivered'].includes(order.status),
        },
        {
          status: isPickup ? t('timeline.pickedUp') : tStatus('delivered'),
          date: order.status === 'delivered' ? t('timeline.completed') : tStatus('pending'),
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
              <h3 className="font-semibold text-foreground mb-1">{t('awaitingTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {isPickup ? t('awaitingBodyPickup') : t('awaitingBodyDelivery')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {isReservation ? t('titleReservation') : t('titleOrder')}
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-mono text-lg text-muted-foreground">{order.orderNumber}</p>
            <OrderStatusBadge status={order.status} showIcon />
          </div>
        </div>
        {!isReservation && (
          <Button className="cursor-pointer" asChild>
            {/* Plain <a>: the i18n Link would prefix the locale (/en/api/...), which 404s. */}
            <a href={`/api/orders/${order.id}/invoice`} download>
              <Download className="w-4 h-4 mr-2" />
              {t('downloadInvoice')}
            </a>
          </Button>
        )}
      </div>

      {/* Order Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-semibold text-foreground mb-6">{t('timelineTitle')}</h2>
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
              {t('itemsOrdered')}
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const instrument = typeof item.instrument === 'object' ? item.instrument : null
                const imageUrl = instrument ? getMediaUrl(instrument.mainImage) : null

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
                          {tInstruments(instrument.instrumentType)}
                          {instrument.model && ` · ${instrument.model}`}
                          {instrument.year && ` · ${instrument.year}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">{t('quantity', { count: 1 })}</p>
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.price, locale)}
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
                {t('shippingInfo')}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('trackingNumber')}</p>
                  <p className="font-mono text-foreground">{order.trackingNumber}</p>
                </div>
                {order.trackingUrl && (
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                    asChild
                  >
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      {t('trackPackage')}
                    </a>
                  </Button>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('estimatedDelivery')}</p>
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
              {isReservation ? t('summaryReservation') : tCheckout('summary.title')}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{tCheckout('summary.subtotal')}</span>
                <span className="text-foreground">{formatPrice(order.subtotal, locale)}</span>
              </div>
              {!isPickup && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('delivery')}</span>
                    <span className="text-green-600">{tCheckout('summary.included')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('insurance')}</span>
                    <span className="text-green-600">{tCheckout('summary.included')}</span>
                  </div>
                </>
              )}
              {isPickup && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('pickup')}</span>
                  <span className="text-green-600">{tCheckout('pickup.free')}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">{tCheckout('summary.total')}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(order.total, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Address */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              {isPickup ? <Building2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              {isPickup ? tCheckout('pickup.title') : tCheckout('shipping.title')}
            </h2>
            {isPickup ? (
              <div className="text-sm text-foreground space-y-1">
                <p className="font-medium">{t('atelierName')}</p>
                <p>Strada 1 Decembrie 1918, nr. 8</p>
                <p>Reghin, Mureș 545300</p>
                <p>{tCheckout('shipping.countries.RO')}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {t('pickupContactNote')}
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
              {t('payment')}
            </h2>
            {isReservation ? (
              <div className="text-sm">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{tStatus('awaitingPayment')}</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {isPickup ? t('paymentNotePickup') : t('paymentNoteDelivery')}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground">
                  {order.paymentMethod === 'bank_transfer' ||
                  order.paymentMethod === 'cash' ||
                  order.paymentMethod === 'card'
                    ? t(`method.${order.paymentMethod}`)
                    : t('method.other')}
                </p>
                {order.paymentIntentId && (
                  <p className="text-xs text-muted-foreground mt-1">ID: {order.paymentIntentId}</p>
                )}
                {order.paymentReference && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('reference', { ref: order.paymentReference })}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button asChild variant="outline" className="cursor-pointer bg-transparent">
        <Link href="/account/orders">{t('backToOrders')}</Link>
      </Button>
    </div>
  )
}
