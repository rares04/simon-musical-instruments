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

    // Map subject value to Romanian labels (Paul's native language)
    const subjectLabelsRo: Record<string, string> = {
      general: 'Întrebare Generală',
      purchase: 'Achiziție Instrument',
      custom: 'Comandă Personalizată',
      other: 'Altele',
    }
    const subjectLabelRo = subjectLabelsRo[subject] || subject

    // Send notification email to Paul (in Romanian)
    await sendEmail({
      to: 'paul.simon@simoninstruments.com',
      subject: `Formular de Contact: ${subjectLabelRo} de la ${name}`,
      react: ContactFormEmail({
        name,
        email,
        phone,
        subject: subjectLabelRo,
        message,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
