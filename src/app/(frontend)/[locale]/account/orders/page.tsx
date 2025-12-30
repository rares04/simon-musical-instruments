'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { OrderCard } from '@/components/account/order-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/account/empty-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/lib/order-types'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: OrderStatus
  items: Array<{ title: string; imageUrl?: string | null }>
  total: number
}

export default function OrdersPage() {
  const { status } = useSession()
  const router = useRouter()
  const t = useTranslations('account.orderHistory')
  const tCommon = useTranslations('common')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const ordersPerPage = 10

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account/orders')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchOrders() {
      if (status !== 'authenticated') return

      try {
        const response = await fetch('/api/account/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [status])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loadingOrders')}</p>
        </div>
      </div>
    )
  }

  // Filter orders by status
  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  )

  // Reset to page 1 when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={t('noOrders')}
        description={t('noOrdersDesc')}
        actionLabel={tCommon('viewAll')}
        actionHref="/gallery"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allOrders')}</SelectItem>
            <SelectItem value="pending_payment">{t('awaitingPayment')}</SelectItem>
            <SelectItem value="paid">{t('paid')}</SelectItem>
            <SelectItem value="processing">{t('processing')}</SelectItem>
            <SelectItem value="shipped">{t('shipped')}</SelectItem>
            <SelectItem value="delivered">{t('delivered')}</SelectItem>
            <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.map((order) => {
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
                    image: firstItem?.imageUrl || '/placeholder.svg',
                  },
                ],
                total: order.total,
                status: order.status,
              }}
              showViewDetails
            />
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            {tCommon('previous')}
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                onClick={() => setCurrentPage(page)}
                className="w-10 cursor-pointer"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            {tCommon('next')}
          </Button>
        </div>
      )}
    </div>
  )
}
