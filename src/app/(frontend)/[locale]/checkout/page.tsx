'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Shield, Package, Truck, Mail, Phone } from 'lucide-react'
import { StripePaymentForm } from '@/components/stripe-payment-form'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const userId = session?.user?.id
  const { items } = useCart()
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')

  // Checkout mode state
  const [checkoutMode, setCheckoutMode] = useState<'purchase' | 'inquiry'>('purchase')

  // Form states
  const [shippingCountry, setShippingCountry] = useState('RO')
  const [isProcessing, setIsProcessing] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'RO',
    message: '',
  })

  // Pre-fill form with session data
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || []
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(' ') || prev.lastName,
        email: session.user?.email || prev.email,
      }))
    }
  }, [session])

  // Store form data in sessionStorage when it changes (for success page)
  useEffect(() => {
    if (checkoutMode === 'purchase') {
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData))
      if (userId) {
        sessionStorage.setItem('checkoutUserId', userId)
      }
    }
  }, [formData, checkoutMode, userId])

  // Calculate shipping (in EUR)
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const shippingCost = shippingCountry === 'RO' ? 50 : shippingCountry === 'EU' ? 150 : 350
  const insurance = Math.ceil(subtotal * 0.02) // 2% insurance
  const total = subtotal + shippingCost + insurance

  // Get shipping region name
  const getShippingRegion = (country: string) => {
    if (country === 'RO') return t('shipping.countries.RO')
    return country
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
            {t('emptyCart.title')}
          </h1>
          <p className="text-muted-foreground mb-6">{t('emptyCart.description')}</p>
          <Button asChild className="cursor-pointer">
            <Link href="/gallery">{t('emptyCart.browse')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit inquiry')
      }

      window.location.href = '/checkout/success?mode=inquiry'
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      alert('Failed to submit inquiry. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'country') {
      setShippingCountry(value)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/gallery"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ← {t('backToShop')}
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-4">
            {t('completeOrder')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>

          {!isAuthenticated && status !== 'loading' && (
            <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm text-foreground">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent('/checkout')}`}
                  className="font-semibold text-accent hover:text-accent/80 cursor-pointer"
                >
                  {t('signInPrompt')}
                </Link>{' '}
                {t('guestCheckout')}
              </p>
            </div>
          )}
        </div>

        {/* Checkout Mode Selection */}
        <div className="mb-8 p-6 bg-muted/30 border border-border rounded-lg">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            {t('mode.title')}
          </h2>
          <RadioGroup
            value={checkoutMode}
            onValueChange={(value) => setCheckoutMode(value as 'purchase' | 'inquiry')}
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-background border border-border rounded-lg hover:border-accent transition-colors cursor-pointer">
                <RadioGroupItem value="purchase" id="purchase" className="mt-1 cursor-pointer" />
                <Label htmlFor="purchase" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">{t('mode.directPurchase')}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('mode.directPurchaseDesc')}
                  </p>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-background border border-border rounded-lg hover:border-accent transition-colors cursor-pointer">
                <RadioGroupItem value="inquiry" id="inquiry" className="mt-1 cursor-pointer" />
                <Label htmlFor="inquiry" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">{t('mode.requestQuote')}</div>
                  <p className="text-sm text-muted-foreground mt-1">{t('mode.requestQuoteDesc')}</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {checkoutMode === 'purchase' ? (
          <StripePaymentForm
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            insurance={insurance}
            total={total}
            formData={formData}
            onInputChange={handleInputChange}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            userId={userId}
          />
        ) : (
          <form onSubmit={handleInquirySubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <section className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    {t('contactInfo.title')}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('contactInfo.firstName')} *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('contactInfo.lastName')} *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">{t('contactInfo.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('contactInfo.phone')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping Information */}
                <section className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    {t('shipping.title')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">{t('shipping.streetAddress')} *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address2">{t('shipping.apartment')}</Label>
                      <Input
                        id="address2"
                        value={formData.address2}
                        onChange={(e) => handleInputChange('address2', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('shipping.city')} *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">{t('shipping.state')} *</Label>
                        <Input
                          id="state"
                          required
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zip">{t('shipping.zip')} *</Label>
                        <Input
                          id="zip"
                          required
                          value={formData.zip}
                          onChange={(e) => handleInputChange('zip', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">{t('shipping.country')} *</Label>
                        <select
                          id="country"
                          required
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          <option value="RO">{t('shipping.countries.RO')}</option>
                          <option value="EU">{t('shipping.countries.EU')}</option>
                          <option value="UK">{t('shipping.countries.UK')}</option>
                          <option value="US">{t('shipping.countries.US')}</option>
                          <option value="CA">{t('shipping.countries.CA')}</option>
                          <option value="AU">{t('shipping.countries.AU')}</option>
                          <option value="OTHER">{t('shipping.countries.OTHER')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Truck className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('shipping.secureShipping')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('shipping.fullInsurance', { amount: insurance.toLocaleString() })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('shipping.professionalPackaging')}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Message */}
                <section className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    {t('message.title')}
                  </h2>
                  <div>
                    <Label htmlFor="message">{t('message.label')}</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('message.placeholder')}
                      className="mt-1.5"
                    />
                  </div>
                </section>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {t('summary.title')}
                  </h2>

                  {/* Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-4 border-b border-border last:border-0"
                      >
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('summary.subtotal')}</span>
                      <span className="font-medium text-foreground">
                        €{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('summary.shipping', { region: getShippingRegion(shippingCountry) })}
                      </span>
                      <span className="font-medium text-foreground">
                        €{shippingCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('summary.insurance')}</span>
                      <span className="font-medium text-foreground">
                        €{insurance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-semibold text-base text-foreground">
                        {t('summary.total')}
                      </span>
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
                    disabled={isProcessing}
                  >
                    {isProcessing ? tCommon('processing') : t('submitInquiry')}
                  </Button>

                  {/* Contact Support */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-xs font-semibold text-foreground">
                      {tCommon('needAssistance')}
                    </p>
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
        )}
      </div>
    </div>
  )
}
