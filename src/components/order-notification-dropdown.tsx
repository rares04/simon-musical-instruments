'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { Link } from '@/i18n/routing'
import type { OrderStatus } from '@/lib/order-types'

interface ActiveOrder {
  id: string
  status: OrderStatus
  itemName: string
  total: number
  createdAt: string
}

export function OrderNotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [orders, setOrders] = useState<ActiveOrder[]>([])
  const [hasPendingPayment, setHasPendingPayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('navigation')

  useEffect(() => {
    async function fetchActiveOrders() {
      try {
        const response = await fetch('/api/account/active-orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
          setHasPendingPayment(data.hasPendingPayment || false)
        }
      } catch (error) {
        console.error('Failed to fetch active orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveOrders()
  }, [])

  // Don't render if no active orders or still loading
  if (isLoading || orders.length === 0) {
    return null
  }

  const urgentOrder = orders.find((o) => o.status === 'pending_payment') || orders[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {hasPendingPayment && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          )}
          {!hasPendingPayment && orders.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-foreground">{t('activeOrders')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('ordersInProgress', { count: orders.length })}
          </p>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {orders.map((order) => (
            <DropdownMenuItem key={order.id} asChild className="cursor-pointer">
              <Link
                href={`/account/orders/${order.id}`}
                className="flex flex-col items-start gap-2 p-3"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                  <OrderStatusBadge
                    status={order.status}
                    size="sm"
                    animate={order.status === 'pending_payment'}
                  />
                </div>
                <p className="text-sm font-medium text-foreground">{order.itemName}</p>
                <p className="text-xs text-muted-foreground">€{order.total.toLocaleString()}</p>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        {hasPendingPayment && urgentOrder && (
          <div className="p-3 border-t border-border bg-amber-500/5">
            <Link href={`/account/orders/${urgentOrder.id}`} onClick={() => setOpen(false)}>
              <Button className="w-full cursor-pointer" size="sm">
                {t('completePayment')} →
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-2">{t('paulWillContact')}</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
