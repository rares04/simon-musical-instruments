import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/order-types'
import { Clock, Check, Package, Truck, CheckCircle, X, RefreshCw, AlertCircle } from 'lucide-react'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  animate?: boolean
}

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> =
  {
    pending: {
      label: 'Pending',
      icon: AlertCircle,
      className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    },
    pending_payment: {
      label: 'Awaiting Payment',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    paid: {
      label: 'Paid',
      icon: Check,
      className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    },
    processing: {
      label: 'Processing',
      icon: Package,
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    shipped: {
      label: 'Shipped',
      icon: Truck,
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle,
      className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    },
    cancelled: {
      label: 'Cancelled',
      icon: X,
      className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    refunded: {
      label: 'Refunded',
      icon: RefreshCw,
      className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    },
  }

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = false,
  animate = false,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        config.className,
        sizeClasses[size],
        animate && status === 'pending_payment' && 'animate-pulse',
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  )
}
