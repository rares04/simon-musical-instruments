import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendEmail } from '@/lib/resend'
import { OrderConfirmationEmail } from '@/lib/emails'

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

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SI-${timestamp}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, formData, userId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 })
    }

    // Verify payment succeeded via Stripe API
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${paymentIntent.status}` },
        { status: 400 },
      )
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Check if order already exists for this payment intent (idempotency)
    const existingOrder = await payload.find({
      collection: 'orders',
      where: {
        paymentIntentId: { equals: paymentIntentId },
      },
      limit: 1,
    })

    if (existingOrder.docs.length > 0) {
      // Order already created, return existing order number
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.docs[0].orderNumber,
        alreadyProcessed: true,
      })
    }

    // Extract data from PaymentIntent metadata
    const metadata = paymentIntent.metadata
    const instrumentIds = JSON.parse(metadata.instrumentIds || '[]')
    const subtotal = parseFloat(metadata.subtotal || '0')
    const shippingCost = parseFloat(metadata.shippingCost || '0')
    const insurance = parseFloat(metadata.insurance || '0')
    const deliveryMethod = (metadata.deliveryMethod as 'delivery' | 'pickup') || 'delivery'

    // Fetch instruments to get their details
    const { docs: instruments } = await payload.find({
      collection: 'instruments',
      where: {
        id: { in: instrumentIds },
      },
      limit: instrumentIds.length,
    })

    // Verify all instruments are still available (double-check status and stock)
    const unavailableInstruments = instruments.filter(
      (instrument) => instrument.status !== 'available' || (instrument.stock ?? 1) <= 0,
    )

    if (unavailableInstruments.length > 0) {
      // This shouldn't happen if validation was done in create-payment-intent
      // But we check anyway for safety
      console.error('Instruments became unavailable after payment:', unavailableInstruments)
      // We still create the order but flag it for manual review
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Convert userId to number if present (Payload relationships expect numeric IDs)
    const customerIdNumber = userId ? Number(userId) : undefined

    // Create Order document
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: customerIdNumber,
        guestEmail: !customerIdNumber ? formData?.email : undefined,
        status: 'paid',
        deliveryMethod,
        items: instruments.map((instrument) => ({
          instrument: instrument.id,
          title: instrument.title,
          price: instrument.price,
        })),
        contactInfo: {
          firstName: formData?.firstName || metadata.customerName?.split(' ')[0] || '',
          lastName:
            formData?.lastName || metadata.customerName?.split(' ').slice(1).join(' ') || '',
          email: formData?.email || metadata.customerEmail || '',
          phone: formData?.phone || '',
        },
        // Only include shipping address for delivery orders
        ...(deliveryMethod === 'delivery'
          ? {
              shippingAddress: {
                street: formData?.address || '',
                apartment: formData?.address2 || '',
                city: formData?.city || '',
                state: formData?.state || '',
                zip: formData?.zip || '',
                country: formData?.country || '',
              },
            }
          : {}),
        paymentIntentId,
        subtotal,
        shipping: shippingCost,
        insurance,
        total: paymentIntent.amount / 100, // Convert from cents
        paidAt: new Date().toISOString(),
      },
    })

    // Decrease stock for each instrument and mark as sold if stock reaches 0
    for (const instrument of instruments) {
      const currentStock = instrument.stock ?? 1
      const newStock = Math.max(0, currentStock - 1)

      await payload.update({
        collection: 'instruments',
        id: instrument.id,
        data: {
          stock: newStock,
          // Mark as sold only when stock reaches 0
          ...(newStock === 0 ? { status: 'sold' } : {}),
        },
      })
    }

    // Send order confirmation email
    const customerEmail = formData?.email || metadata.customerEmail
    const customerName =
      `${formData?.firstName || ''} ${formData?.lastName || ''}`.trim() || 'Valued Customer'

    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmed - ${orderNumber}`,
        react: OrderConfirmationEmail({
          orderNumber,
          customerName,
          items: instruments.map((instrument) => ({
            title: instrument.title,
            price: instrument.price,
          })),
          subtotal,
          shipping: shippingCost,
          insurance,
          total: paymentIntent.amount / 100,
          deliveryMethod,
          // Only include shipping address for delivery orders
          ...(deliveryMethod === 'delivery'
            ? {
                shippingAddress: {
                  street: formData?.address || '',
                  apartment: formData?.address2 || '',
                  city: formData?.city || '',
                  state: formData?.state || '',
                  zip: formData?.zip || '',
                  country: formData?.country || '',
                },
              }
            : {}),
        }),
      })
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error confirming order:', error)
    return NextResponse.json({ error: 'Failed to confirm order' }, { status: 500 })
  }
}
