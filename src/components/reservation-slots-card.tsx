'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

interface ReservationSlotsCardProps {
  count: number
  limit?: number
}

export function ReservationSlotsCard({ count, limit = 2 }: ReservationSlotsCardProps) {
  const t = useTranslations('reservations')

  // Don't render if no reservations
  if (count === 0) {
    return null
  }
  const atLimit = count >= limit
  const slotsUsed = Math.min(count, limit)

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-foreground">{t('slots')}</h3>
        {atLimit && <AlertTriangle className="h-5 w-5 text-amber-600" />}
      </div>

      <div className="flex items-center gap-4">
        {/* Slot indicators */}
        {Array.from({ length: limit }).map((_, index) => {
          const isUsed = index < slotsUsed
          return (
            <div
              key={index}
              className={`flex-1 aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                isUsed
                  ? 'border-accent bg-accent/10'
                  : 'border-dashed border-muted-foreground/30 bg-muted/20'
              }`}
            >
              {isUsed ? (
                <span className="text-3xl">🎻</span>
              ) : (
                <span className="text-2xl text-muted-foreground/30">[ ]</span>
              )}
            </div>
          )
        })}

        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {t('slotsCount', { count: slotsUsed, limit })}
          </p>
          <p className="text-xs text-muted-foreground">
            {atLimit ? t('limitReached') : t('slotsAvailable')}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-pretty">
        {atLimit ? t('completePaymentToReserve') : t('canReserveMore')}
      </p>

      <div className="flex gap-3">
        {atLimit ? (
          <>
            <Button asChild variant="outline" className="flex-1 bg-transparent cursor-pointer">
              <Link href="/contact">{t('contactPaul')}</Link>
            </Button>
            <Button asChild className="flex-1 cursor-pointer">
              <Link href="/account/orders">{t('manageReservations')}</Link>
            </Button>
          </>
        ) : (
          <Button asChild className="w-full cursor-pointer">
            <Link href="/account/orders">{t('viewReservations')}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

