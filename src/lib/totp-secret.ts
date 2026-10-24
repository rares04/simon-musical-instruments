import crypto from 'node:crypto'
import type { CollectionAfterReadHook, CollectionBeforeChangeHook } from 'payload'

// Admins' authenticator secrets (payload-totp's `totpSecret` field) are stored encrypted with
// AES-256-GCM. The key comes from TOTP_ENC_KEY (32 bytes, base64), which is not in the database,
// so a database dump or backup does not expose the secrets. It is independent of PAYLOAD_SECRET,
// so rotating that secret does not affect enrolments.
//
// The plugin reads and writes the secret only through the Local API, so these collection hooks see
// every read and write.

const PREFIX = 'enc1:'

/**
 * Returned in place of a secret this server cannot decrypt (missing or wrong key, damaged value).
 * It is not valid base32, so no code can ever match it: the admin stays enrolled and cannot pass
 * verification (fail closed) instead of appearing not enrolled. Recovery is in the runbook.
 */
export const UNREADABLE_TOTP_SECRET = 'unreadable!'

function encryptionKey(): Buffer | null {
  const raw = process.env.TOTP_ENC_KEY
  if (!raw) return null
  const key = Buffer.from(raw, 'base64')
  return key.length === 32 ? key : null
}

export const isEncryptedTotpSecret = (value: string) => value.startsWith(PREFIX)

export function encryptTotpSecret(secret: string): string {
  const key = encryptionKey()
  if (!key) {
    throw new Error(
      'TOTP_ENC_KEY is missing or not 32 bytes; refusing to store an authenticator secret',
    )
  }
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return (
    PREFIX + [iv, cipher.getAuthTag(), ciphertext].map((b) => b.toString('base64url')).join(':')
  )
}

export function decryptTotpSecret(stored: string): string {
  const key = encryptionKey()
  const parts = isEncryptedTotpSecret(stored) ? stored.slice(PREFIX.length).split(':') : []
  if (!key || parts.length !== 3) return UNREADABLE_TOTP_SECRET
  try {
    const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, 'base64url'))
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  } catch {
    return UNREADABLE_TOTP_SECRET
  }
}

export const encryptTotpSecretBeforeChange: CollectionBeforeChangeHook = ({ data }) => {
  const secret = data?.totpSecret
  // Never overwrite a stored secret with the placeholder: fixing the key must bring it back.
  if (secret === UNREADABLE_TOTP_SECRET) {
    delete data.totpSecret
    return data
  }
  if (typeof secret === 'string' && secret && !isEncryptedTotpSecret(secret)) {
    data.totpSecret = encryptTotpSecret(secret)
  }
  return data
}

export const decryptTotpSecretAfterRead: CollectionAfterReadHook = ({ doc, req }) => {
  const stored = doc?.totpSecret
  if (typeof stored === 'string' && stored) {
    doc.totpSecret = decryptTotpSecret(stored)
    if (doc.totpSecret === UNREADABLE_TOTP_SECRET) {
      req.payload.logger.error(
        'totp: an authenticator secret could not be decrypted; check TOTP_ENC_KEY',
      )
    }
  }
  return doc
}
