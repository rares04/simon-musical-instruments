import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateEnv } from '@/env'

const valid = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  PAYLOAD_SECRET: 'x'.repeat(32),
  AUTH_SECRET: 'secret',
}

describe('validateEnv', () => {
  afterEach(() => vi.restoreAllMocks())

  it('accepts the minimal required variables', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => validateEnv(valid)).not.toThrow()
  })

  it('names every missing or invalid required variable', () => {
    const env = { PAYLOAD_SECRET: '' }
    expect(() => validateEnv(env)).toThrow(/DATABASE_URL[\s\S]*PAYLOAD_SECRET[\s\S]*AUTH_SECRET/)
  })

  it('rejects a malformed NEXT_PUBLIC_SITE_URL', () => {
    const env = { ...valid, NEXT_PUBLIC_SITE_URL: 'not a url' }
    expect(() => validateEnv(env)).toThrow(/NEXT_PUBLIC_SITE_URL/)
  })
})
