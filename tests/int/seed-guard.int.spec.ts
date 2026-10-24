import { describe, it, expect, vi, afterEach } from 'vitest'
import { assertSafeSeedTarget } from '../../scripts/seed-guard'

const local = { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' }

describe('assertSafeSeedTarget', () => {
  afterEach(() => vi.restoreAllMocks())

  it('allows a local database with no S3 endpoint', () => {
    expect(() => assertSafeSeedTarget(local, ['node', 'seed'])).not.toThrow()
    expect(() =>
      assertSafeSeedTarget({ DATABASE_URL: 'postgresql://u:p@127.0.0.1/db' }, []),
    ).not.toThrow()
  })

  it('allows a local S3 endpoint', () => {
    expect(() =>
      assertSafeSeedTarget({ ...local, S3_ENDPOINT: 'http://127.0.0.1:4568' }, []),
    ).not.toThrow()
  })

  it('refuses a remote database', () => {
    const env = { DATABASE_URL: 'postgresql://u:p@db.example.supabase.co:5432/postgres' }
    expect(() => assertSafeSeedTarget(env, [])).toThrow(/Refusing to seed.*DATABASE_URL/)
  })

  it('refuses a missing or malformed DATABASE_URL', () => {
    expect(() => assertSafeSeedTarget({}, [])).toThrow(/Refusing to seed/)
    expect(() => assertSafeSeedTarget({ DATABASE_URL: 'not a url' }, [])).toThrow(/Refusing/)
  })

  it('refuses a remote S3 endpoint even with a local database', () => {
    const env = { ...local, S3_ENDPOINT: 'https://abc.storage.supabase.co/storage/v1/s3' }
    expect(() => assertSafeSeedTarget(env, [])).toThrow(/S3_ENDPOINT/)
  })

  it('does not echo credentials in the error', () => {
    const env = { DATABASE_URL: 'postgresql://user:hunter2@db.example.com/db' }
    try {
      assertSafeSeedTarget(env, [])
    } catch (e) {
      expect(String(e)).not.toContain('hunter2')
    }
  })

  it('--force bypasses the check with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const env = { DATABASE_URL: 'postgresql://u:p@db.example.com/db' }
    expect(() => assertSafeSeedTarget(env, ['node', 'seed', '--force'])).not.toThrow()
    expect(warn).toHaveBeenCalled()
  })
})
