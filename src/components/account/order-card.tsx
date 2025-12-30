import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { ChevronRight } from 'lucide-react'
import type { OrderStatus } from '@/lib/order-types'

interface OrderCardProps {
  order: {
    id: string
    date: string
    items: Array<{ name: string; image: string }>
    total: number
    status: OrderStatus
  }
  showViewDetails?: boolean
}

export function OrderCard({ order, showViewDetails = false }: OrderCardProps) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-accent transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Order Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
          <Image
            src={order.items[0].image || '/placeholder.svg'}
            alt={order.items[0].name}
            fill
            className="object-cover"
          />
        </div>

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0">
              <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
              <h3 className="font-semibold text-foreground mt-1 truncate">{order.items[0].name}</h3>
              {order.items.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  +{order.items.length - 1} more item(s)
                </p>
              )}
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              <p className="text-muted-foreground">{formattedDate}</p>
              <p className="font-semibold text-foreground mt-1">€{order.total.toLocaleString()}</p>
            </div>

            {showViewDetails && (
              <div className="flex items-center gap-1 text-sm text-accent">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
