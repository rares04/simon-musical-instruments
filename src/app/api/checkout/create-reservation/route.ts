import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendEmail } from '@/lib/resend'
import { OrderConfirmationEmail } from '@/lib/emails'
import { NewReservationNotificationEmail } from '@/lib/emails/new-reservation-notification'

const RESERVATION_LIMIT = 2

function generateReservationNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SI-${timestamp}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const { items, formData, userId, total } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Validate required fields
    const baseRequiredFields = ['firstName', 'lastName', 'email', 'phone']
    const addressFields = ['address', 'city', 'state', 'zip', 'country']
    const requiredFields =
      formData.deliveryMethod === 'pickup'
        ? baseRequiredFields
        : [...baseRequiredFields, ...addressFields]

    const missingFields = requiredFields.filter((field) => !formData[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 },
      )
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
    const calculatedTotal = instruments.reduce((sum, instrument) => sum + instrument.price, 0)

    // Allow small rounding differences (1 EUR)
    if (Math.abs(calculatedTotal - total) > 1) {
      return NextResponse.json(
        { error: 'Price mismatch. Please refresh the page and try again.' },
        { status: 400 },
      )
    }

    // Generate reservation number
    const reservationNumber = generateReservationNumber()

    // Convert userId to number if present and verify user exists
    let customerIdNumber: number | undefined = undefined
    if (userId) {
      try {
        const user = await payload.findByID({
          collection: 'users',
          id: Number(userId),
        })
        if (user) {
          customerIdNumber = user.id
        }
      } catch {
        // User doesn't exist, treat as guest checkout
        console.log(`User ${userId} not found, treating as guest checkout`)
      }
    }

    // Check reservation limit for authenticated users
    if (customerIdNumber || formData.email) {
      const { docs: existingReservations } = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { status: { equals: 'pending_payment' } },
            {
              or: [
                ...(customerIdNumber ? [{ customer: { equals: customerIdNumber } }] : []),
                { guestEmail: { equals: formData.email } },
              ],
            },
          ],
        },
        limit: RESERVATION_LIMIT + 1,
      })

      if (existingReservations.length >= RESERVATION_LIMIT) {
        return NextResponse.json(
          {
            error: 'reservation_limit_reached',
            message: `You have reached the maximum of ${RESERVATION_LIMIT} pending reservations. Please complete payment on an existing reservation or cancel one before making a new reservation.`,
            count: existingReservations.length,
            limit: RESERVATION_LIMIT,
          },
          { status: 400 },
        )
      }
    }

    // Create Order document with pending_payment status
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: reservationNumber,
        customer: customerIdNumber,
        guestEmail: !customerIdNumber ? formData.email : undefined,
        status: 'pending_payment',
        paymentMethod: formData.deliveryMethod === 'pickup' ? 'cash' : 'bank_transfer',
        deliveryMethod: formData.deliveryMethod,
        items: instruments.map((instrument) => ({
          instrument: instrument.id,
          title: instrument.title,
          price: instrument.price,
        })),
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        // Only include shipping address for delivery orders
        ...(formData.deliveryMethod === 'delivery'
          ? {
              shippingAddress: {
                street: formData.address,
                apartment: formData.address2 || '',
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                country: formData.country,
              },
            }
          : {}),
        subtotal: calculatedTotal,
        shipping: 0, // Delivery included in price
        insurance: 0, // Insurance included in price
        total: calculatedTotal,
      },
    })

    // Mark instruments as reserved (change status to reduce visibility)
    for (const instrument of instruments) {
      await payload.update({
        collection: 'instruments',
        id: instrument.id,
        data: {
          status: 'reserved',
        },
        context: {
          skipAutoTranslate: true, // Don't trigger translation for status change
        },
      })
    }

    // Prepare email data
    const customerEmail = formData.email
    const customerName = `${formData.firstName} ${formData.lastName}`.trim()

    // Send emails in background (don't block the response)
    const sendEmails = async () => {
      try {
        // Send confirmation email to buyer
        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            subject: `Reservation Confirmed - ${reservationNumber}`,
            react: OrderConfirmationEmail({
              orderNumber: reservationNumber,
              customerName,
              items: instruments.map((instrument) => ({
                title: instrument.title,
                price: instrument.price,
              })),
              subtotal: calculatedTotal,
              shipping: 0,
              insurance: 0,
              total: calculatedTotal,
              deliveryMethod: formData.deliveryMethod,
              isReservation: true,
              ...(formData.deliveryMethod === 'delivery'
                ? {
                    shippingAddress: {
                      street: formData.address,
                      apartment: formData.address2 || '',
                      city: formData.city,
                      state: formData.state,
                      zip: formData.zip,
                      country: formData.country,
                    },
                  }
                : {}),
            }),
          })
          console.log(`✅ Confirmation email sent to ${customerEmail}`)
        }

        // Send notification email to Paul
        await sendEmail({
          to: 'paul.simon@simoninstruments.com',
          subject: `New Reservation - ${reservationNumber}`,
          react: NewReservationNotificationEmail({
            reservationNumber,
            customerName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            items: instruments.map((instrument) => ({
              title: instrument.title,
              price: instrument.price,
            })),
            total: calculatedTotal,
            deliveryMethod: formData.deliveryMethod,
            ...(formData.deliveryMethod === 'delivery'
              ? {
                  shippingAddress: {
                    street: formData.address,
                    apartment: formData.address2 || '',
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                  },
                }
              : {}),
          }),
        })
        console.log(`✅ Notification email sent to Paul`)
      } catch (emailError) {
        console.error('❌ Error sending emails:', emailError)
        // Don't throw - reservation is already created
      }
    }

    // Fire and forget - don't await emails
    sendEmails()

    return NextResponse.json({
      success: true,
      reservationNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}
