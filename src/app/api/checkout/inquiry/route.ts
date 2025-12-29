import { type NextRequest, NextResponse } from 'next/server'
import { sendEmail, EMAIL_FROM } from '@/lib/resend'
import { InquiryReceivedEmail } from '@/lib/emails'

interface InquiryItem {
  id: string
  name: string
  type: string
  price: number
}

export async function POST(req: NextRequest) {
  try {
    const { items, formData } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    if (!formData?.email || !formData?.firstName || !formData?.lastName) {
      return NextResponse.json({ error: 'Missing required contact information' }, { status: 400 })
    }

    const customerName = `${formData.firstName} ${formData.lastName}`
    const customerEmail = formData.email
    const total = items.reduce((sum: number, item: InquiryItem) => sum + item.price, 0)

    // Send confirmation email to customer
    const customerEmailResult = await sendEmail({
      to: customerEmail,
      subject: 'Your Inquiry - Simon Musical Instruments',
      react: InquiryReceivedEmail({
        customerName,
        customerEmail,
        items: items.map((item: InquiryItem) => ({
          title: item.name,
          price: item.price,
        })),
        message: formData.message || undefined,
        total,
      }),
    })

    // Also send notification to the shop owner
    const ownerNotificationHtml = `
      <h2>New Inquiry Received</h2>
      <p><strong>From:</strong> ${customerName} (${customerEmail})</p>
      <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      
      <h3>Instruments of Interest:</h3>
      <ul>
        ${items.map((item: InquiryItem) => `<li>${item.name} - €${item.price.toLocaleString()}</li>`).join('')}
      </ul>
      <p><strong>Estimated Total:</strong> €${total.toLocaleString()}</p>
      
      ${formData.message ? `<h3>Customer Message:</h3><p>${formData.message}</p>` : ''}
      
      <h3>Shipping Address:</h3>
      <p>
        ${formData.address || ''}<br/>
        ${formData.city || ''}, ${formData.state || ''} ${formData.zip || ''}<br/>
        ${formData.country || ''}
      </p>
    `

    // Send to shop owner (using Resend directly for HTML email)
    const { resend } = await import('@/lib/resend')
    await resend.emails.send({
      from: EMAIL_FROM,
      to: 'paul.simon@simoninstruments.com', // Shop owner email
      subject: `New Inquiry from ${customerName}`,
      html: ownerNotificationHtml,
      replyTo: customerEmail,
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
    })
  } catch (error) {
    console.error('Error processing inquiry:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}
