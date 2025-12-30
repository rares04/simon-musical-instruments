'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import {
  CheckCircle2,
  Package,
  Mail,
  Phone,
  Loader2,
  XCircle,
  Clock,
  CreditCard,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const t = useTranslations('checkoutSuccess')
  const tCommon = useTranslations('common')
  const [reservationNumber, setReservationNumber] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [mode, setMode] = useState<'reservation' | 'inquiry' | 'payment'>('payment')
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) return
    hasProcessed.current = true

    const modeParam = searchParams.get('mode')
    const numberParam = searchParams.get('number')
    const paymentIntent = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')

    // Handle reservation mode (new flow - no payment)
    if (modeParam === 'reservation') {
      setMode('reservation')
      if (numberParam) {
        setReservationNumber(numberParam)
      }
      setLoading(false)
      clearCart()
      return
    }

    // Handle inquiry mode (no payment)
    if (modeParam === 'inquiry') {
      setMode('inquiry')
      setLoading(false)
      clearCart()
      return
    }

    // Handle payment mode (Stripe - currently disabled)
    if (!paymentIntent) {
      // If no payment intent and no mode, show error
      setError('No payment information found')
      setLoading(false)
      return
    }

    if (redirectStatus !== 'succeeded') {
      setError(`Payment was not successful. Status: ${redirectStatus}`)
      setLoading(false)
      return
    }

    /**
     * STRIPE DISABLED: The code below handles Stripe payment confirmation.
     * Currently disabled in favor of reservation flow.
     */
    setError('Stripe payments are currently disabled. Please use the reservation flow.')
    setLoading(false)
  }, [searchParams, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">{t('confirmingOrder')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">{t('error.title')}</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">{t('error.paymentNote')}</p>
          <div className="space-y-3">
            <Button asChild className="w-full cursor-pointer">
              <Link href="/checkout">{tCommon('tryAgain')}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full cursor-pointer bg-transparent">
              <a href="mailto:paul.simon@simoninstruments.com">{tCommon('contactSupport')}</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Reservation success page (new v0 design)
  if (mode === 'reservation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              {t('reservation.title')}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              {t('reservation.subtitle')}
            </p>
          </div>

          {/* Reservation Details Card */}
          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">
                {t('reservation.reservationNumber')}
              </p>
              <p className="font-mono text-xl font-semibold text-foreground">{reservationNumber}</p>
            </div>

            {/* What Happens Next */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                {t('reservation.whatHappensNext')}
              </h2>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-accent">1</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    {t('reservation.step1Title')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t('reservation.step1Desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-accent">2</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    {t('reservation.step2Title')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t('reservation.step2Desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-accent">3</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent" />
                    {t('reservation.step3Title')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t('reservation.step3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Email Notice */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">{t('reservation.emailSent')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('reservation.emailSentDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <p className="font-semibold text-foreground mb-3">{t('reservation.questionsAbout')}</p>
            <div className="space-y-2">
              <a
                href="mailto:paul.simon@simoninstruments.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>paul.simon@simoninstruments.com</span>
              </a>
              <a
                href="tel:+40744960722"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>+40 744 960 722</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="flex-1 cursor-pointer">
              <Link href="/gallery">{t('continueShopping')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer bg-transparent"
            >
              <Link href="/">{t('returnHome')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Inquiry success page
  if (mode === 'inquiry') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              {t('inquiry.title')}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">{t('inquiry.subtitle')}</p>
          </div>

          {/* Next Steps Card */}
          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              {t('inquiry.whatNext')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{t('inquiry.confirmationEmail')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('inquiry.confirmationEmailDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{t('inquiry.personalResponse')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('inquiry.personalResponseDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    {t('inquiry.consultationAvailable')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('inquiry.consultationAvailableDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
            <p className="font-semibold text-foreground mb-3">{t('inquiry.immediateAssistance')}</p>
            <div className="space-y-2">
              <a
                href="mailto:paul.simon@simoninstruments.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>paul.simon@simoninstruments.com</span>
              </a>
              <a
                href="tel:+40744960722"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>+40 744 960 722</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="flex-1 cursor-pointer">
              <Link href="/gallery">{t('continueShopping')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer bg-transparent"
            >
              <Link href="/">{t('returnHome')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Order confirmation page (payment mode - currently disabled)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            {t('order.title')}
          </h1>
          <p className="text-lg text-muted-foreground text-balance">{t('order.subtitle')}</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('order.orderNumber')}</p>
            <p className="font-mono text-xl font-semibold text-foreground">{reservationNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">{t('order.confirmationEmail')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('order.confirmationEmailDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">{t('order.shippingTracking')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('order.shippingTrackingDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
          <p className="font-semibold text-foreground mb-3">{t('order.questionsAboutOrder')}</p>
          <div className="space-y-2">
            <a
              href="mailto:paul.simon@simoninstruments.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>paul.simon@simoninstruments.com</span>
            </a>
            <a
              href="tel:+40744960722"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>+40 744 960 722</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1 cursor-pointer">
            <Link href="/gallery">{t('continueShopping')}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 cursor-pointer bg-transparent"
          >
            <Link href="/">{t('returnHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
