import 'server-only'
import { business } from '@/lib/seo/business'
import { OTP_EXPIRY_MINUTES } from '@/lib/otp'
import { HOLD_HOURS } from '@/lib/reservations'
import type { LegalValues } from './placeholders'

/**
 * Legal identity of the seller, shown on the privacy policy and terms of sale.
 * Source: the Railway invoices (2026-10). `regCom` is pending from the owner (P-1); while it is
 * null the pages show the locale's `legal.common.pending` text.
 */
export const company = {
  legalName: 'Simon Paul Răzvan Întreprindere Individuală',
  address: 'Str. 1 Decembrie 1918 nr. 8, 545300 Reghin, jud. Mureș, România',
  vat: 'RO32793842',
  regCom: null as string | null,
  email: business.email,
  phone: '+40 744 960 722',
} as const

/** Date of the current text of the legal pages (ISO). Update it with every content change. */
export const LEGAL_VERSION = '2026-11-05'

export function legalValues(pending: string): LegalValues {
  return {
    legalName: company.legalName,
    address: company.address,
    vat: company.vat,
    regCom: company.regCom ?? pending,
    email: company.email,
    phone: company.phone,
    holdHours: String(HOLD_HOURS),
    otpMinutes: String(OTP_EXPIRY_MINUTES),
  }
}
