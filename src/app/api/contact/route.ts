import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import { ContactFormEmail } from '@/lib/emails/contact-form'
import { limitByIp } from '@/lib/rate-limit'
import { captchaFailed, verifyTurnstile } from '@/lib/turnstile'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUBJECTS = ['general', 'purchase', 'custom', 'visit', 'other']

export async function POST(request: Request) {
  try {
    const limited = limitByIp(request, 'contact')
    if (limited) return limited

    const body = await request.json().catch(() => ({}))
    if (!(await verifyTurnstile(body.turnstileToken, request))) return captchaFailed()

    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    const name = str(body.name)
    const email = str(body.email)
    const phone = str(body.phone)
    const subject = str(body.subject)
    const message = str(body.message)

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (
      name.length > 100 ||
      phone.length > 40 ||
      message.length > 5000 ||
      email.length > 254 ||
      !EMAIL_RE.test(email) ||
      !SUBJECTS.includes(subject)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Map subject value to Romanian labels (Paul's native language)
    const subjectLabelsRo: Record<string, string> = {
      general: 'Întrebare Generală',
      purchase: 'Achiziție Instrument',
      custom: 'Comandă Personalizată',
      visit: 'Vizită la Atelier',
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
