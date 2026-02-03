'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CheckoutLimitReached } from '@/components/checkout-limit-reached'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import {
  Shield,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  Info,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PendingReservation {
  id: string
  name: string
  date: string
  price: number
}

interface SavedAddress {
  id: string
  label: string
  street: string
  apartment?: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const userId = session?.user?.id
  const { items, clearCart } = useCart()
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const router = useRouter()

  // Form states
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  // Reservation limit state
  const [reservationCount, setReservationCount] = useState(0)
  const [reservationLimit, setReservationLimit] = useState(2)
  const [pendingReservations, setPendingReservations] = useState<PendingReservation[]>([])
  const [isLoadingReservations, setIsLoadingReservations] = useState(true)

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

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
    deliveryMethod: 'delivery' as 'delivery' | 'pickup',
    customerRemarks: '',
  })

  // Fetch reservation count to check limit
  useEffect(() => {
    async function fetchReservationCount() {
      setIsLoadingReservations(true)
      try {
        const response = await fetch('/api/account/reservation-count')
        if (response.ok) {
          const data = await response.json()
          setReservationCount(data.count || 0)
          setReservationLimit(data.limit || 2)
          setPendingReservations(data.pendingReservations || [])
        }
      } catch (error) {
        console.error('Failed to fetch reservation count:', error)
      } finally {
        setIsLoadingReservations(false)
      }
    }
    fetchReservationCount()
  }, [])

  // Fetch saved addresses when authenticated
  useEffect(() => {
    async function fetchAddresses() {
      if (!isAuthenticated) return
      setIsLoadingAddresses(true)
      try {
        const response = await fetch('/api/account/profile')
        if (response.ok) {
          const data = await response.json()
          const addresses = data.savedAddresses || []
          setSavedAddresses(addresses)
          // Auto-select default address if available
          const defaultAddress = addresses.find((a: SavedAddress) => a.isDefault)
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
            applyAddress(defaultAddress)
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error)
      } finally {
        setIsLoadingAddresses(false)
      }
    }
    fetchAddresses()
  }, [isAuthenticated])

  // Apply selected address to form
  const applyAddress = (address: SavedAddress) => {
    setFormData((prev) => ({
      ...prev,
      address: address.street,
      address2: address.apartment || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    }))
  }

  // Handle address selection change
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    if (addressId === 'new') {
      // Clear address fields for new address entry
      setFormData((prev) => ({
        ...prev,
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'RO',
      }))
    } else {
      const address = savedAddresses.find((a) => a.id === addressId)
      if (address) {
        applyAddress(address)
      }
    }
  }

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

  // Calculate total - delivery & insurance already included in instrument price
  const total = items.reduce((sum, item) => sum + item.price, 0)

  // Redirect if cart is empty (but not if we're processing a reservation)
  if (items.length === 0 && !isProcessing) {
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

  // Show loading while checking reservation limit
  if (isLoadingReservations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }

  // Show limit reached page if user has max reservations
  if (reservationCount >= reservationLimit) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutLimitReached pendingReservations={pendingReservations} />
      </div>
    )
  }

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

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
        setError(t('errors.fillRequired'))
        setIsProcessing(false)
        return
      }

      const response = await fetch('/api/checkout/create-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            type: item.type,
          })),
          formData,
          userId,
          total,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit reservation')
      }

      const data = await response.json()

      // Redirect to success page (cart will be cleared there)
      // Keep isProcessing = true to prevent empty cart flash during navigation
      router.push(`/checkout/success?mode=reservation&number=${data.reservationNumber}`)
      // Don't reset isProcessing - let the navigation complete
    } catch (err) {
      console.error('Error submitting reservation:', err)
      setError(err instanceof Error ? err.message : t('errors.reservationFailed'))
      setIsProcessing(false) // Only reset on error
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
            {t('reserveInstrument')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('noPaymentRequired')}</p>

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

        {/* How It Works Info Box */}
        <div className="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-2">{t('howItWorks')}</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>{t('howItWorksStep1')}</li>
                <li>{t('howItWorksStep2')}</li>
                <li>{t('howItWorksStep3')}</li>
                <li>{t('howItWorksStep4')}</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={handleReservationSubmit}>
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

              {/* Delivery Method */}
              <section className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                  {t('deliveryMethod.title')}
                </h2>
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${formData.deliveryMethod === 'delivery' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                  >
                    <RadioGroupItem
                      value="delivery"
                      id="delivery"
                      className="mt-1 cursor-pointer"
                    />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-foreground">
                          {t('deliveryMethod.delivery')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('deliveryMethod.deliveryDesc')}
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
                          {t('deliveryMethod.pickup')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('deliveryMethod.pickupDesc')}
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </section>

              {/* Pickup Location (shown when pickup selected) */}
              {formData.deliveryMethod === 'pickup' && (
                <section className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                    {t('pickup.title')}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Simon Musical Instruments</p>
                        <p className="text-sm text-muted-foreground">
                          Strada 1 Decembrie 1918, nr. 8
                          <br />
                          Reghin 545300, Mureș County
                          <br />
                          Romania
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-accent/20">
                      <p className="text-sm text-muted-foreground">{t('pickup.note')}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Delivery Address (shown when delivery selected) */}
              {formData.deliveryMethod === 'delivery' && (
                <section className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    {t('shipping.title')}
                  </h2>
                  <div className="space-y-4">
                    {/* Saved Addresses Selector */}
                    {isAuthenticated && savedAddresses.length > 0 && (
                      <div>
                        <Label>{t('shipping.savedAddresses')}</Label>
                        <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder={t('shipping.selectAddress')} />
                          </SelectTrigger>
                          <SelectContent>
                            {savedAddresses.map((address) => (
                              <SelectItem key={address.id} value={address.id}>
                                <span className="font-medium">{address.label}</span>
                                <span className="text-muted-foreground ml-2">
                                  - {address.street}, {address.city}
                                </span>
                                {address.isDefault && (
                                  <span className="ml-2 text-xs text-accent">(Default)</span>
                                )}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">{t('shipping.enterNewAddress')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="address">{t('shipping.streetAddress')} *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => {
                          handleInputChange('address', e.target.value)
                          // Clear selection if user edits manually
                          if (selectedAddressId && selectedAddressId !== 'new') {
                            setSelectedAddressId('new')
                          }
                        }}
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

                    {/* Delivery Details */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Truck className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('shipping.secureShipping')}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{t('shipping.fullInsurance')}</span>
                      </div> */}
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('shipping.professionalPackaging')}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Customer Remarks */}
              <section className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    {t('remarks.title')}
                  </div>
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="customerRemarks">{t('remarks.label')}</Label>
                  <Textarea
                    id="customerRemarks"
                    value={formData.customerRemarks}
                    onChange={(e) => handleInputChange('customerRemarks', e.target.value)}
                    placeholder={t('remarks.placeholder')}
                    className="mt-1.5 min-h-[120px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">{t('remarks.hint')}</p>
                </div>
              </section>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
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
                      <div className="relative w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
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
                <div className="space-y-3 pt-4">
                  {/* {formData.deliveryMethod === 'delivery' ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('summary.deliveryIncluded')}</span>
                      <span className="font-medium text-green-600">{t('summary.included')}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('pickup.fromAtelier')}</span>
                      <span className="font-medium text-green-600">{t('pickup.free')}</span>
                    </div>
                  )} */}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-semibold text-base text-foreground">
                      {t('summary.total')}
                    </span>
                    <span className="font-serif text-2xl font-bold text-accent">
                      €{total.toLocaleString()}
                    </span>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">{t('summary.priceNote')}</p> */}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 cursor-pointer"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {tCommon('processing')}
                    </>
                  ) : (
                    t('reserveButton')
                  )}
                </Button>

                {/* No Payment Required Note */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-foreground mb-1">{t('noPaymentNow')}</p>
                  <p className="text-xs text-muted-foreground">{t('paulContactNote')}</p>
                </div>

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
      </div>
    </div>
  )
}
