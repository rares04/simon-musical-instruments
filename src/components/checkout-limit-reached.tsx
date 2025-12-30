'use client'

import { AlertTriangle, Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

interface PendingReservation {
  id: string
  name: string
  date: string
  price: number
}

interface CheckoutLimitReachedProps {
  pendingReservations: PendingReservation[]
}

export function CheckoutLimitReached({ pendingReservations }: CheckoutLimitReachedProps) {
  const t = useTranslations('reservations')
  const tCommon = useTranslations('common')

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-card border-2 border-amber-500/20 rounded-lg p-8 lg:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {t('limitReachedTitle')}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg mx-auto text-pretty">
              {t('limitReachedDescription')}
            </p>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="font-semibold text-foreground">{t('yourPendingReservations')}</h2>

            <div className="space-y-3">
              {pendingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-muted/30 border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-mono text-xs text-muted-foreground">{reservation.id}</p>
                      <p className="font-semibold text-foreground mt-1">{reservation.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('reservedOn', {
                          date: new Date(reservation.date).toLocaleDateString(),
                        })}{' '}
                        • €{reservation.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent cursor-pointer"
                      asChild
                    >
                      <Link href="/contact">{t('contactPaul')}</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 cursor-pointer" asChild>
                      <Link href={`/account/orders/${reservation.id}`}>
                        {tCommon('viewDetails')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 cursor-pointer">
                <Link href="/account/orders">{t('viewAllReservations')}</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent cursor-pointer">
                <Link href="/gallery">{t('returnToGallery')}</Link>
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm font-semibold text-foreground mb-2">{t('needHelp')}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <a
                  href="mailto:paul.simon@simoninstruments.com"
                  className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  {t('emailPaul')}
                </a>
                <a
                  href="tel:+40744960722"
                  className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  {t('callPaul')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
