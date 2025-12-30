'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Image from 'next/image'
import { Shield, Package, Truck, Mail, Phone, Loader2, MapPin } from 'lucide-react'
import type { CartItem } from '@/lib/cart-context'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface StripePaymentFormProps {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  insurance: number
  total: number
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    address2: string
    city: string
    state: string
    zip: string
    country: string
    deliveryMethod: 'delivery' | 'pickup'
  }
  onInputChange: (field: string, value: string) => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  userId?: string
}

function CheckoutForm({
  items,
  subtotal,
  shippingCost,
  insurance,
  total,
  formData,
  onInputChange,
  isProcessing,
  setIsProcessing,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      // Validate form data - address fields only required for delivery
      const baseRequiredFields = ['firstName', 'lastName', 'email', 'phone']
      const addressFields = ['address', 'city', 'state', 'zip', 'country']

      const requiredFields =
        formData.deliveryMethod === 'pickup'
          ? baseRequiredFields
          : [...baseRequiredFields, ...addressFields]

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData],
      )

      if (missingFields.length > 0) {
        setErrorMessage('Please fill in all required fields')
        setIsProcessing(false)
        return
      }

      // Confirm payment with Stripe
      const billingDetails: {
        name: string
        email: string
        phone: string
        address?: {
          line1: string
          line2?: string
          city: string
          state: string
          postal_code: string
          country: string
        }
      } = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      }

      // Only include address for delivery orders
      if (formData.deliveryMethod === 'delivery') {
        billingDetails.address = {
          line1: formData.address,
          line2: formData.address2 || undefined,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip,
          country: formData.country,
        }
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: billingDetails,
          },
        },
      })

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment')
        setIsProcessing(false)
      }
    } catch (_err) {
      setErrorMessage('An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </section>

          {/* Delivery Method */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              How would you like to receive your instrument?
            </h2>
            <RadioGroup
              value={formData.deliveryMethod}
              onValueChange={(value) => onInputChange('deliveryMethod', value)}
              className="space-y-3"
            >
              <div
                className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${formData.deliveryMethod === 'delivery' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
              >
                <RadioGroupItem value="delivery" id="delivery" className="mt-1 cursor-pointer" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-foreground">Door-to-Door Delivery</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your instrument is picked up from our atelier and delivered directly to your
                    address. Delivery & insurance included in price.
                  </p>
                </Label>
              </div>
              <div
                className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${formData.deliveryMethod === 'pickup' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
              >
                <RadioGroupItem value="pickup" id="pickup" className="mt-1 cursor-pointer" />
                <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-foreground">
                      Pickup from Atelier (Reghin, Romania)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit our workshop in person to collect your instrument. Meet the luthier and
                    see where your instrument was crafted.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </section>

          {/* Pickup Information (shown when pickup selected) */}
          {formData.deliveryMethod === 'pickup' && (
            <section className="bg-accent/5 border border-accent/20 rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                Pickup Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Simon Musical Instruments</p>
                    <p className="text-sm text-muted-foreground">
                      Str. Castelului 112
                      <br />
                      Reghin 545300, Mureș County
                      <br />
                      Romania
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    After your purchase, we&apos;ll contact you to schedule a convenient pickup
                    time. Pickup is available Monday–Friday, 9:00 AM – 5:00 PM.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Delivery Address (shown when delivery selected) */}
          {formData.deliveryMethod === 'delivery' && (
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => onInputChange('address', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="address2">Apartment, Suite, etc.</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => onInputChange('address2', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => onInputChange('city', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) => onInputChange('state', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">Postal Code *</Label>
                    <Input
                      id="zip"
                      required
                      value={formData.zip}
                      onChange={(e) => onInputChange('zip', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => onInputChange('country', e.target.value)}
                      className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    >
                      <option value="RO">Romania</option>
                      <option value="EU">European Union</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other International</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Door-to-door delivery with signature confirmation
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Delivery & insurance included in price
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Professional packaging with climate protection
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Payment Information */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Payment Information
            </h2>
            <div className="space-y-4">
              <PaymentElement />
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Your payment information is encrypted and secure via Stripe</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="relative w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground text-balance leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.type}</p>
                    <p className="font-serif font-semibold text-accent mt-2">
                      €{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 pt-4 border-t border-border">
              {formData.deliveryMethod === 'delivery' ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Door-to-door delivery & insurance</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup from Atelier</span>
                  <span className="font-medium text-muted-foreground">—</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold text-base text-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-accent">
                  €{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 cursor-pointer"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Complete Purchase'
              )}
            </Button>

            {/* Contact Support */}
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs font-semibold text-foreground">Need assistance?</p>
              <div className="space-y-1.5">
                <a
                  href="mailto:paul.simon@simoninstruments.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Mail className="h-3 w-3" />
                  <span>paul.simon@simoninstruments.com</span>
                </a>
                <a
                  href="tel:+40744960722"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Phone className="h-3 w-3" />
                  <span>+40 744 960 722</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Create PaymentIntent on mount
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/checkout/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: props.items,
            shippingCost: props.shippingCost,
            insurance: props.insurance,
            total: props.total,
            formData: props.formData,
            userId: props.userId,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.',
        )
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [props.items, props.shippingCost, props.insurance, props.total, props.formData, props.userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Initializing secure payment...</span>
      </div>
    )
  }

  if (error || !clientSecret) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-600">{error || 'Failed to load payment form'}</p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
