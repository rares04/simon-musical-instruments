import { Resend } from 'resend'
import { captureError } from '@/lib/observability/errors'
import { trackServerEvent, type EmailTemplate } from '@/lib/observability/events'

// Lazy-initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null

export function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

// Email sender configuration
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Paul Simon <paul.simon@simoninstruments.com>'

/**
 * Sends an email and never throws. Every failure is reported to error tracking (it alerts), and
 * each send is recorded as an `email_sent` / `email_failed` event. Pass `template` so failures say
 * which email it was.
 */
export async function sendEmail({
  to,
  subject,
  react,
  template = 'unknown',
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
  template?: EmailTemplate
}) {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    })

    if (error) {
      reportEmailFailure(template, error.name, new Error(`${error.name}: ${error.message}`))
      return { success: false, error }
    }

    trackServerEvent('email_sent', { template })
    return { success: true, data }
  } catch (error) {
    reportEmailFailure(template, error instanceof Error ? error.name : 'Error', error)
    return { success: false, error }
  }
}

function reportEmailFailure(template: EmailTemplate, errorName: string, error: unknown): void {
  trackServerEvent('email_failed', { template, error_name: errorName })
  captureError(error, { source: 'email', template })
}
