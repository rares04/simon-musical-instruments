import { cn } from '@/lib/utils'

interface OrderStatusBadgeProps {
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
}

const statusConfig: Record<OrderStatusBadgeProps['status'], { label: string; className: string }> =
  {
    pending: {
      label: 'Pending',
      className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    },
    paid: {
      label: 'Paid',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    processing: {
      label: 'Processing',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    shipped: {
      label: 'Shipped',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    delivered: {
      label: 'Delivered',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
    refunded: {
      label: 'Refunded',
      className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
  }

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
