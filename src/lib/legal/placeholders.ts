export type LegalValues = Record<string, string>

/** Replaces `{name}` placeholders. Unknown names are left as they are, so tests can catch them. */
export function fillPlaceholders(text: string, values: LegalValues): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match)
}

/** Placeholders the legal texts may use. */
export const LEGAL_PLACEHOLDERS = [
  'legalName',
  'address',
  'vat',
  'regCom',
  'email',
  'phone',
  'holdHours',
  'otpMinutes',
] as const
