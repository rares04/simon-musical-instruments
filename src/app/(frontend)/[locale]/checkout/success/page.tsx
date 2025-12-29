'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { CheckCircle2, Package, Mail, Phone, Loader2, XCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [isInquiry, setIsInquiry] = useState(false)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) return
    hasProcessed.current = true

    const mode = searchParams.get('mode')
    const paymentIntent = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')

    // Handle inquiry mode (no payment)
    if (mode === 'inquiry') {
      setIsInquiry(true)
      setLoading(false)
      clearCart()
      return
    }

    // Handle payment mode
    if (!paymentIntent) {
      setError('No payment information found')
      setLoading(false)
      return
    }

    if (redirectStatus !== 'succeeded') {
      setError(`Payment was not successful. Status: ${redirectStatus}`)
      setLoading(false)
      return
    }

    // Confirm the order with our backend
    const confirmOrder = async () => {
      try {
        // Get form data from sessionStorage (stored before redirect)
        const storedFormData = sessionStorage.getItem('checkoutFormData')
        const storedUserId = sessionStorage.getItem('checkoutUserId')
        const formData = storedFormData ? JSON.parse(storedFormData) : null
        const userId = storedUserId || undefined

        const response = await fetch('/api/checkout/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent,
            formData,
            userId,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to confirm order')
        }

        const data = await response.json()
        setOrderNumber(data.orderNumber)

        // Clear cart after successful order confirmation
        clearCart()

        // Clear stored form data
        sessionStorage.removeItem('checkoutFormData')
        sessionStorage.removeItem('checkoutUserId')
      } catch (err) {
        console.error('Error confirming order:', err)
        setError(err instanceof Error ? err.message : 'Failed to confirm order')
      } finally {
        setLoading(false)
      }
    }

    confirmOrder()
  }, [searchParams, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Confirming your order...</p>
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            If your payment was processed, please contact us and we&apos;ll help resolve this.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full cursor-pointer">
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full cursor-pointer bg-transparent">
              <a href="mailto:paul.simon@simoninstruments.com">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Inquiry success page
  if (isInquiry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Inquiry Submitted!
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Thank you for your interest. We&apos;ll respond to your inquiry within 1-2 business
              days.
            </p>
          </div>

          {/* Next Steps Card */}
          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              What Happens Next
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ve sent a confirmation email with your inquiry details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Personal Response</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paul or Ecaterina Simon will personally review your inquiry and respond with
                    detailed information about the instruments you&apos;re interested in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Consultation Available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We can arrange a phone or video call to discuss your needs and help you find the
                    perfect instrument.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
            <p className="font-semibold text-foreground mb-3">Need immediate assistance?</p>
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
              <Link href="/gallery">Continue Shopping</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer bg-transparent"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Order confirmation page (payment mode)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Thank you for your purchase. Your handcrafted instrument is being prepared for shipment.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="font-mono text-xl font-semibold text-foreground">{orderNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Confirmation Email</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ve sent a confirmation email with your order details and tracking
                  information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Shipping & Tracking</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your instrument will be carefully packaged and shipped via FedEx with full
                  insurance. You&apos;ll receive tracking details within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
          <p className="font-semibold text-foreground mb-3">Questions about your order?</p>
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
            <Link href="/gallery">Continue Shopping</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 cursor-pointer bg-transparent"
          >
            <Link href="/">Return Home</Link>
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
