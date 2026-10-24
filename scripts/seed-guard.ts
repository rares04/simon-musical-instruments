const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

function hostOf(value: string | undefined): string | null {
  if (!value) return null
  try {
    return new URL(value).hostname
  } catch {
    return 'invalid'
  }
}

/**
 * The seed deletes every order, instrument and media file, and Payload's S3 plugin deletes the
 * matching objects from the bucket. Refuse to run unless both the database and (when set) the S3
 * endpoint are local, or the caller passed `--force`.
 */
export function assertSafeSeedTarget(
  env: Record<string, string | undefined> = process.env,
  argv: string[] = process.argv,
): void {
  if (argv.includes('--force')) {
    console.warn('⚠️  --force: skipping the local-target check. This deletes data.')
    return
  }
  const problems: string[] = []
  const dbHost = hostOf(env.DATABASE_URL)
  if (!dbHost || !LOCAL_HOSTS.has(dbHost)) {
    problems.push(`DATABASE_URL host is "${dbHost ?? 'not set'}", not local`)
  }
  const s3Host = hostOf(env.S3_ENDPOINT)
  if (s3Host && !LOCAL_HOSTS.has(s3Host)) {
    problems.push(`S3_ENDPOINT host is "${s3Host}", not local`)
  }
  if (problems.length > 0) {
    throw new Error(
      `Refusing to seed: ${problems.join('; ')}. The seed deletes all orders, instruments and ` +
        'media. Point it at a local database (and unset S3_* or use a local S3), or pass --force.',
    )
  }
}
