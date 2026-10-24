import { z } from 'zod'

const required = z.string().min(1)

const schema = z.object({
  DATABASE_URL: required,
  PAYLOAD_SECRET: required,
  AUTH_SECRET: required,
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
})

/** Needed for a feature to work, but the site still boots without them. Warn, don't crash. */
const recommended = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY',
  'S3_SECRET_KEY',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DEEPL_API_KEY',
] as const

/**
 * Validates the environment at server startup (see src/instrumentation.ts).
 * Throws when a variable the app cannot run without is missing or malformed.
 */
export function validateEnv(env: Record<string, string | undefined> = process.env): void {
  const result = schema.safeParse(env)
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid environment:\n${problems}`)
  }

  if ((env.PAYLOAD_SECRET?.length ?? 0) < 32) {
    console.warn('[env] PAYLOAD_SECRET is shorter than 32 characters; rotate it to a longer value')
  }

  const missing = recommended.filter((key) => !env[key])
  if (missing.length > 0) {
    console.warn(
      `[env] Optional variables not set (related features are disabled): ${missing.join(', ')}`,
    )
  }
}
