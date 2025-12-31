import { Package, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { OrderCard } from '@/components/account/order-card'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { ReservationSlotsCard } from '@/components/reservation-slots-card'
import { requireAuth } from '@/lib/auth-guard'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getMediaUrl } from '@/lib/media-utils'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard - Simon Musical Instruments',
  description: 'Your account dashboard',
}

export default async function AccountDashboard() {
  const session = await requireAuth()
  const payload = await getPayload({ config })
  const t = await getTranslations('account.dashboard')

  const userId = session.user?.id
  const userEmail = session.user?.email

  if (!userId || !userEmail) {
    throw new Error('User session is invalid')
  }

  // Fetch user's orders
  const { docs: orders, totalDocs } = await payload.find({
    collection: 'orders',
    where: {
      or: [{ customer: { equals: userId } }, { guestEmail: { equals: userEmail } }],
    },
    sort: '-createdAt',
    limit: 10, // Get more to check for pending_payment
    depth: 2, // Increase depth to get instrument images
  })

  // Filter orders needing attention (pending_payment)
  const ordersNeedingAttention = orders.filter((o) => o.status === 'pending_payment')

  // Calculate stats
  const stats = {
    totalOrders: totalDocs,
    pending: orders.filter((o) =>
      ['pending', 'pending_payment', 'paid', 'processing'].includes(o.status),
    ).length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
  }

  // Get recent 3 for display
  const recentOrders = orders.slice(0, 3)

  const user = session.user
  const userName = user.firstName || user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {t('welcome', { name: userName })}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Pending Payment Alert */}
      {ordersNeedingAttention.length > 0 && (
        <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {t('pendingPaymentAlert', { count: ordersNeedingAttention.length })}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{t('pendingPaymentDesc')}</p>
              <div className="space-y-2">
                {ordersNeedingAttention.map((order) => {
                  const firstItem = order.items?.[0]
                  return (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.orderNumber}`}
                      className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-accent transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-mono text-sm text-muted-foreground">
                          {order.orderNumber}
                        </p>
                        <p className="font-medium text-foreground mt-0.5">
                          {firstItem?.title || 'Instrument'}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} animate />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Slots Card */}
      <ReservationSlotsCard count={ordersNeedingAttention.length} limit={2} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-accent" />
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
          <p className="text-sm text-muted-foreground">{t('totalOrders')}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">{t('pending')}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
          <p className="text-sm text-muted-foreground">{t('delivered')}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-accent font-semibold">€</span>
          </div>
          <p className="text-2xl font-bold text-foreground">€{stats.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{t('totalSpent')}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">{t('recentOrders')}</h2>
          {totalDocs > 3 && (
            <Button asChild variant="ghost" className="cursor-pointer">
              <Link href="/account/orders">{t('viewAll')}</Link>
            </Button>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const firstItem = order.items?.[0]
              const instrument =
                firstItem && typeof firstItem.instrument === 'object' ? firstItem.instrument : null
              const imageUrl = instrument ? getMediaUrl(instrument.mainImage) : null
              return (
                <OrderCard
                  key={order.id}
                  order={{
                    id: order.orderNumber,
                    date: new Date(order.createdAt).toISOString().split('T')[0],
                    items: [
                      {
                        name: firstItem?.title || 'Instrument',
                        image: imageUrl || '/placeholder.svg',
                      },
                    ],
                    total: order.total,
                    status: order.status,
                  }}
                />
              )
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">{t('noOrders')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('startBrowsing')}</p>
            <Button asChild className="cursor-pointer">
              <Link href="/gallery">{t('browseInstruments')}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/profile"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors cursor-pointer"
        >
          <h3 className="font-semibold text-foreground mb-2">{t('profileSettings')}</h3>
          <p className="text-sm text-muted-foreground">{t('profileSettingsDesc')}</p>
        </Link>

        <Link
          href="/gallery"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors cursor-pointer"
        >
          <h3 className="font-semibold text-foreground mb-2">{t('browseInstruments')}</h3>
          <p className="text-sm text-muted-foreground">{t('browseInstrumentsDesc')}</p>
        </Link>
      </div>
    </div>
  )
}
