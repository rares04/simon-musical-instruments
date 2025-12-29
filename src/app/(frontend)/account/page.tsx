import { Package, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrderCard } from '@/components/account/order-card'
import { requireAuth } from '@/lib/auth-guard'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  title: 'Dashboard - Simon Musical Instruments',
  description: 'Your account dashboard',
}

export default async function AccountDashboard() {
  const session = await requireAuth()
  const payload = await getPayload({ config })

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
    limit: 3, // Only get recent 3 for dashboard
    depth: 1,
  })

  // Calculate stats
  const stats = {
    totalOrders: totalDocs,
    pending: orders.filter((o) => ['pending', 'paid', 'processing'].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
  }

  const user = session.user
  const userName = user.firstName || user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">Manage your account and view your order history</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-accent" />
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
          <p className="text-sm text-muted-foreground">Delivered</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-accent font-semibold">€</span>
          </div>
          <p className="text-2xl font-bold text-foreground">€{stats.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Spent</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">Recent Orders</h2>
          {totalDocs > 3 && (
            <Button asChild variant="ghost" className="cursor-pointer">
              <Link href="/account/orders">View All</Link>
            </Button>
          )}
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items?.[0]
              return (
                <OrderCard
                  key={order.id}
                  order={{
                    id: order.orderNumber,
                    date: new Date(order.createdAt).toISOString().split('T')[0],
                    items: [
                      {
                        name: firstItem?.title || 'Instrument',
                        image: '/placeholder.svg',
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
            <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start browsing our collection of handcrafted instruments
            </p>
            <Button asChild className="cursor-pointer">
              <Link href="/gallery">Browse Instruments</Link>
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
          <h3 className="font-semibold text-foreground mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information and preferences
          </p>
        </Link>

        <Link
          href="/gallery"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors cursor-pointer"
        >
          <h3 className="font-semibold text-foreground mb-2">Browse Instruments</h3>
          <p className="text-sm text-muted-foreground">
            Discover our collection of handcrafted instruments
          </p>
        </Link>
      </div>
    </div>
  )
}
