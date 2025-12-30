'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

interface ReservationSlotIndicatorProps {
  count: number
  limit?: number
  variant?: 'header' | 'account'
}

export function ReservationSlotIndicator({
  count,
  limit = 2,
  variant = 'header',
}: ReservationSlotIndicatorProps) {
  const t = useTranslations('reservations')

  // Don't show anything if no reservations
  if (count === 0) {
    return null
  }

  const atLimit = count >= limit

  if (variant === 'header') {
    return (
      <Link
        href="/account/orders"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          atLimit
            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        {atLimit && <AlertTriangle className="h-4 w-4" />}
        <span>
          {count}/{limit} {count === 1 ? t('reservation') : t('reservations')}
        </span>
      </Link>
    )
  }

  // Account variant
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
        atLimit ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'
      }`}
    >
      {atLimit && <AlertTriangle className="h-4 w-4" />}
      <span>{t('slotsUsed', { count, limit })}</span>
    </div>
  )
}

