import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { payloadTotp } from 'payload-totp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Instruments } from './collections/Instruments'
import { Orders } from './collections/Orders'
import { scrubError, scrubText } from './lib/observability/scrub'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Payload's own error logs. DB errors carry customer data in their message ("params: …") and in
 * driver fields such as `detail`, so errors are reduced to name, code and a scrubbed message and
 * stack. Production logs JSON lines (Railway indexes the fields); development keeps the default
 * pretty output.
 */
function safeErr(err: unknown) {
  const safe = scrubError(err)
  const raw = err as { code?: unknown; cause?: { code?: unknown } } | null
  const code = raw?.code ?? raw?.cause?.code
  return {
    type: safe.name,
    message: safe.message,
    stack: safe.stack,
    ...(typeof code === 'string' ? { code } : {}),
  }
}

export default buildConfig({
  ...(process.env.NODE_ENV === 'production'
    ? {
        logger: {
          options: {
            level: process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info',
            serializers: { err: safeErr, error: safeErr },
            hooks: {
              logMethod(args, method) {
                // pino copies an error's raw message into `msg` when it's logged as an Error or as
                // `{ err }` without a message, so give those an explicit scrubbed `msg`.
                const scrubbed = args.map((arg) => {
                  if (typeof arg === 'string') return scrubText(arg)
                  if (arg instanceof Error) return { err: arg, msg: scrubText(arg.message) }
                  if (arg && typeof arg === 'object') {
                    const fields = arg as { msg?: unknown; err?: unknown; error?: unknown }
                    if (typeof fields.msg === 'string')
                      return { ...arg, msg: scrubText(fields.msg) }
                    const error = fields.err ?? fields.error
                    if (error instanceof Error) return { ...arg, msg: scrubText(error.message) }
                  }
                  return arg
                })
                return method.apply(this, scrubbed as Parameters<typeof method>)
              },
            },
          },
        },
      }
    : {}),
  admin: {
    user: Users.slug,
    // No Gravatar: it would send a hash of each admin's email to a third party on every page.
    avatar: 'default',
    // No generated Open Graph image (it pointed at the container's internal host); this also
    // turns off Payload's /api/og endpoint.
    meta: { defaultOGImageType: 'off' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Română', code: 'ro' },
      { label: 'Deutsch', code: 'de' },
      { label: 'Français', code: 'fr' },
      { label: 'Nederlands', code: 'nl' },
      { label: '日本語', code: 'ja' },
      { label: '한국어', code: 'ko' },
      { label: 'Ελληνικά', code: 'el' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Users, Media, Instruments, Orders],
  editor: lexicalEditor(),
  // The app only uses REST and the Local API.
  graphQL: {
    disable: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: true, // Required for Supabase Storage
      },
    }),
    // Admin 2FA with an authenticator app. Keep it the LAST plugin: it wraps the access of every
    // collection registered before it (public reads opt out, see src/access). Optional per admin
    // until `forceSetup` is turned on. ADMIN_TOTP_DISABLED=true is the emergency switch: it keeps
    // the schema and the enrolments. Secrets are encrypted at rest (src/lib/totp-secret.ts).
    payloadTotp({
      collection: 'users',
      disabled: process.env.ADMIN_TOTP_DISABLED === 'true',
      forceWhiteBackgroundOnQrCode: true,
      totp: { issuer: 'Simon Instruments' },
    }),
  ],
})
