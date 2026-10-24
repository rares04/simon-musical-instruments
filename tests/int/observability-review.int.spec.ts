import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CaptureResult } from 'posthog-js'
import { scrubError, scrubProperties, scrubText, scrubUrl } from '@/lib/observability/scrub'
import { sanitizeClientEvent, sanitizeElementsChain } from '@/lib/observability/client-config'
import { logger } from '@/lib/observability/logger'

// Regression tests for the PR #17 review findings.

describe('multi-line query parameters', () => {
  it('redacts params that span lines, up to the first stack frame', () => {
    const message =
      'Failed query: update "orders" set "notes" = $1 where id = $2\n' +
      'params: Please call after 6pm,\nI live at Strada Florilor 5 Reghin, Ion Popescu,42'
    expect(scrubText(message)).toBe(
      'Failed query: update "orders" set "notes" = $1 where id = $2\nparams: [redacted]',
    )
    const stack = `DrizzleQueryError: ${message}\n    at update (/app/src/lib/reservations.ts:90:5)`
    const out = scrubText(stack)
    expect(out).not.toContain('Florilor')
    expect(out).not.toContain('Popescu')
    expect(out).toContain('at update (/app/src/lib/reservations.ts:90:5)')
  })
})

describe('IDs, timestamps and versions are not mistaken for phone numbers', () => {
  it('leaves UUIDs alone', () => {
    const ids = [
      '01a1b2c3-4567-7890-8123-4abcdef01234',
      '123e4567-e89b-12d3-a456-426614174000',
      '00000000-1111-2222-3333-444444444444',
    ]
    for (let i = 0; i < 200; i++) ids.push(crypto.randomUUID())
    for (const id of ids) expect(scrubText(id)).toBe(id)
  })

  it('leaves timestamps, user agents and order numbers alone, still catches phones', () => {
    for (const value of [
      '2026-10-24 10:00',
      '2026-10-24T10:00:00.000Z',
      'Mozilla/5.0 Chrome/141.0.7390.122 Safari/537.36',
      'SI-2026-0042',
      'SI-MH5X2K-9F3A1C',
    ]) {
      expect(scrubText(value)).toBe(value)
    }
    expect(scrubText('call +40 712 345 678')).toBe('call [number]')
  })

  it('keeps PostHog session ids intact inside $ properties', () => {
    const id = '01a1b2c3-4567-7890-8123-4abcdef01234'
    expect(scrubProperties({ $session_id: id })).toEqual({ $session_id: id })
  })
})

describe('fails closed', () => {
  it('truncates very deep values instead of passing them through', () => {
    let deep: Record<string, unknown> = { email: 'x@y.co', name: 'Jane' }
    for (let i = 0; i < 10; i++) deep = { level: deep }
    expect(JSON.stringify(scrubProperties(deep))).not.toMatch(/x@y\.co|Jane/)
  })

  it('handles URL, Date, Map and class instances', () => {
    class Order {
      email = 'a@b.co'
    }
    const out = scrubProperties({
      link: new URL('https://simoninstruments.com/en?email=a@b.co'),
      when: new Date('2026-10-24T10:00:00Z'),
      map: new Map([['email', 'a@b.co']]),
      order: new Order(),
    })
    expect(out).toEqual({
      link: 'https://simoninstruments.com/en',
      when: '2026-10-24T10:00:00.000Z',
      map: '[object]',
      order: '[object]',
    })
  })

  it('drops free-text and name-like order fields', () => {
    expect(
      scrubProperties({ customerRemarks: 'x', displayName: 'Jane', surname: 'Doe', order: 'SI-1' }),
    ).toEqual({ order: 'SI-1' })
  })
})

describe('URLs', () => {
  it('keeps encoded characters and protocol-relative hosts', () => {
    expect(scrubUrl('/en/gallery/Cello%3Fx')).toBe('/en/gallery/Cello%3Fx')
    expect(scrubUrl('//cdn.example.com/a.js?b=1')).toBe('//cdn.example.com/a.js')
    expect(scrubUrl('/en/u/jane%40example.com/x')).toBe('/en/u/[email]/x')
  })
})

describe('errors keep diagnostics', () => {
  it('keeps the SQLSTATE and a scrubbed cause chain', () => {
    const cause = Object.assign(new Error('duplicate key for jane@example.com'), { code: '23505' })
    const error = new Error('Failed query: insert …\nparams: jane@example.com', { cause })
    error.name = 'DrizzleQueryError'
    const safe = scrubError(error)
    expect(safe.code).toBe('23505')
    expect((safe.cause as Error).message).toBe('duplicate key for [email]')
  })
})

describe('autocapture element data', () => {
  it('drops the avatar alt/src and element text, scrubs link URLs', () => {
    const chain =
      'img.rounded-full:attr__alt="Jane Doe"attr__src="https://lh3.googleusercontent.com/a/xyz"nth-child="1";' +
      'a:attr__href="/en/contact?instrument=Cello"href="/en/contact?instrument=Cello"text="Jane Doe"'
    const out = sanitizeElementsChain(chain)
    expect(out).not.toContain('Jane')
    expect(out).not.toContain('googleusercontent')
    expect(out).toContain('attr__href="/en/contact"')
  })

  it('cleans $elements objects in before_send', () => {
    const event = {
      event: '$autocapture',
      properties: {
        $current_url: 'https://simoninstruments.com/en/gallery',
        $elements: [{ tag_name: 'img', attr__alt: 'Jane Doe', $el_text: 'Jane', nth_child: 1 }],
      },
    } as unknown as CaptureResult
    const out = sanitizeClientEvent(event, { appEnv: 'test', appVersion: 'x' })
    expect(out?.properties.$elements).toEqual([{ tag_name: 'img', nth_child: 1 }])
  })
})

describe('logger core fields', () => {
  afterEach(() => vi.restoreAllMocks())

  it('cannot be overwritten by caller fields, and keeps the error digest and code', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = Object.assign(new Error('boom'), { digest: 'abc123', code: 'ECONNREFUSED' })
    logger.error('real message', { level: 'info', msg: 'fake', time: 'never', err: error })
    const line = JSON.parse(spy.mock.calls[0]?.[0] as string)
    expect(line.level).toBe('error')
    expect(line.msg).toBe('real message')
    expect(line.time).not.toBe('never')
    expect(line.err).toMatchObject({ digest: 'abc123', code: 'ECONNREFUSED' })
  })
})
