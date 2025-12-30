'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { OrderCard } from '@/components/account/order-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/account/empty-state'
import { Package } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/lib/order-types'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: OrderStatus
  items: Array<{ title: string }>
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

  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const currentOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

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
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
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
                    image: '/placeholder.svg',
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
