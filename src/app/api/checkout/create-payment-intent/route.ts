/**
 * STRIPE DISABLED: Online payments temporarily disabled in favor of reservation flow.
 * Buyers now reserve instruments and pay via bank transfer arranged personally with Paul.
 *
 * To re-enable Stripe payments:
 * 1. Uncomment the code below
 * 2. Update checkout page to use StripePaymentForm component
 * 3. Ensure STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are set
 *
 * See: create-reservation/route.ts for the current reservation flow
 */

/*
import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Lazy-initialize Stripe to avoid build-time errors
let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2025-12-15.clover',
    })
  }
  return stripeClient
}

export async function POST(req: NextRequest) {
  try {
    const { items, shippingCost, insurance, total, formData, userId } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Validate all instruments are available
    const instrumentIds = items.map((item: { id: string }) => item.id)

    const { docs: instruments } = await payload.find({
      collection: 'instruments',
      where: {
        id: { in: instrumentIds },
      },
      limit: instrumentIds.length,
    })

    // Check if all instruments exist
    if (instruments.length !== instrumentIds.length) {
      return NextResponse.json(
        { error: 'One or more instruments no longer exist' },
        { status: 400 },
      )
    }

    // Check if all instruments are available (status and stock)
    const unavailableInstruments = instruments.filter(
      (instrument) => instrument.status !== 'available' || (instrument.stock ?? 1) <= 0,
    )

    if (unavailableInstruments.length > 0) {
      const unavailableNames = unavailableInstruments.map((i) => i.title).join(', ')
      return NextResponse.json(
        { error: `The following instruments are no longer available: ${unavailableNames}` },
        { status: 400 },
      )
    }

    // Verify the total matches what we expect
    const calculatedSubtotal = instruments.reduce((sum, instrument) => sum + instrument.price, 0)
    const calculatedTotal = calculatedSubtotal + shippingCost + insurance

    // Allow small rounding differences (1 EUR)
    if (Math.abs(calculatedTotal - total) > 1) {
      return NextResponse.json(
        { error: 'Price mismatch. Please refresh the page and try again.' },
        { status: 400 },
      )
    }

    // Create PaymentIntent
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        instrumentIds: JSON.stringify(instrumentIds),
        shippingCost: shippingCost.toString(),
        insurance: insurance.toString(),
        subtotal: calculatedSubtotal.toString(),
        userId: userId || '',
        customerEmail: formData?.email || '',
        customerName: formData ? `${formData.firstName} ${formData.lastName}` : '',
        deliveryMethod: formData?.deliveryMethod || 'delivery',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
*/

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Online payments are currently disabled. Please use the reservation flow to reserve your instrument.',
    },
    { status: 501 },
  )
}
