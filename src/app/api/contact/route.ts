import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import { ContactFormEmail } from '@/lib/emails/contact-form'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map subject value to human-readable label
    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      purchase: 'Instrument Purchase',
      custom: 'Custom Order',
      other: 'Other',
    }
    const subjectLabel = subjectLabels[subject] || subject

    // Send notification email to Paul
    await sendEmail({
      to: 'paul.simon@simoninstruments.com',
      subject: `New Contact Form: ${subjectLabel} from ${name}`,
      react: ContactFormEmail({
        name,
        email,
        phone,
        subject: subjectLabel,
        message,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
