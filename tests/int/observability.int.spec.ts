import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CaptureResult } from 'posthog-js'
import { scrubError, scrubProperties, scrubText, scrubUrl } from '@/lib/observability/scrub'
import { isAdminPath, sanitizeClientEvent } from '@/lib/observability/client-config'
import { logger, requestIdFrom } from '@/lib/observability/logger'

const DRIZZLE_ERROR =
  'Failed query: insert into "orders" ("customer_email", "customer_name") values ($1, $2)\n' +
  'params: jane.doe@example.com,Jane Doe,+40 712 345 678'

describe('scrubText', () => {
  it('removes query parameters from database errors', () => {
    const out = scrubText(DRIZZLE_ERROR)
    expect(out).toContain('Failed query: insert into "orders"')
    expect(out).toContain('params: [redacted]')
    expect(out).not.toContain('jane.doe')
    expect(out).not.toContain('Jane Doe')
    expect(out).not.toContain('712')
  })

  it('keeps the stack trace after a redacted params line', () => {
    const out = scrubText(`${DRIZZLE_ERROR}\n    at createOrder (/app/src/route.ts:12:3)`)
    expect(out).toContain('at createOrder (/app/src/route.ts:12:3)')
  })

  it('removes emails and phone numbers from free text', () => {
    expect(scrubText('Invalid `to` field: a.b+tag@mail.co.uk')).toBe('Invalid `to` field: [email]')
    expect(scrubText('call 0040 744-123-456 now')).toBe('call [number] now')
    expect(scrubText('order SI-2026-0042, 3 items')).toBe('order SI-2026-0042, 3 items')
  })
})

describe('scrubUrl', () => {
  it('drops personal query parameters', () => {
    expect(scrubUrl('/en/verify-email?email=a%40b.co&p=c2VjcmV0')).toBe('/en/verify-email')
    expect(scrubUrl('https://simoninstruments.com/en/contact?instrument=Cello&inquiry=price')).toBe(
      'https://simoninstruments.com/en/contact',
    )
  })

  it('keeps campaign and ad-click parameters', () => {
    expect(
      scrubUrl('https://simoninstruments.com/en?utm_source=t&gclid=x&email=a@b.co&wbraid=w#top'),
    ).toBe('https://simoninstruments.com/en?utm_source=t&gclid=x&wbraid=w')
  })

  it('redacts emails in the path and handles other schemes', () => {
    expect(scrubUrl('/en/users/a%40b.co/edit')).toBe('/en/users/[email]/edit')
    expect(scrubUrl('file:///app/.next/server/chunk.js')).toBe('file:///app/.next/server/chunk.js')
  })
})

describe('scrubProperties', () => {
  it('drops personal keys, keeps PostHog routing keys and scrubs nested URLs', () => {
    const out = scrubProperties({
      token: 'phc_public',
      distinct_id: 'abc',
      email: 'a@b.co',
      customerName: 'Jane',
      password: 'x',
      instrument_id: '42',
      error_name: 'TypeError',
      $current_url: 'https://simoninstruments.com/en/checkout?email=a@b.co',
      $set_once: { $initial_current_url: '/en/verify-email?email=a@b.co&p=x' },
      note: 'reach me at a@b.co',
    })
    expect(out).toEqual({
      token: 'phc_public',
      distinct_id: 'abc',
      instrument_id: '42',
      error_name: 'TypeError',
      $current_url: 'https://simoninstruments.com/en/checkout',
      $set_once: { $initial_current_url: '/en/verify-email' },
      note: 'reach me at [email]',
    })
  })
})

describe('scrubError', () => {
  it('keeps the name and digest, scrubs message and stack', () => {
    const original = Object.assign(new Error(DRIZZLE_ERROR), {
      name: 'DrizzleQueryError',
      digest: 'd1',
    })
    const safe = scrubError(original)
    expect(safe.name).toBe('DrizzleQueryError')
    expect((safe as Error & { digest?: string }).digest).toBe('d1')
    expect(safe.message).not.toContain('jane.doe')
    expect(safe.stack ?? '').not.toContain('jane.doe')
  })
})

describe('sanitizeClientEvent', () => {
  const ctx = { appEnv: 'test', appVersion: 'abc1234' }
  const event = (url: string, extra: Record<string, unknown> = {}): CaptureResult =>
    ({
      uuid: 'u1',
      event: '$pageview',
      properties: { token: 'phc_public', $current_url: url, ...extra },
      $set_once: { $initial_current_url: url },
    }) as unknown as CaptureResult

  it('drops events from the admin panel', () => {
    expect(
      sanitizeClientEvent(event('https://simoninstruments.com/admin/collections/orders'), ctx),
    ).toBeNull()
    expect(isAdminPath('/administrator')).toBe(false)
  })

  it('strips personal URL parameters everywhere, keeps campaign ones, adds locale', () => {
    const out = sanitizeClientEvent(
      event('https://simoninstruments.com/ro/gallery?utm_source=ig&type=cello&email=a@b.co'),
      ctx,
    )
    expect(out?.properties.$current_url).toBe(
      'https://simoninstruments.com/ro/gallery?utm_source=ig',
    )
    expect(out?.$set_once?.$initial_current_url).toBe(
      'https://simoninstruments.com/ro/gallery?utm_source=ig',
    )
    expect(out?.properties.locale).toBe('ro')
    expect(out?.properties.app_version).toBe('abc1234')
    expect(out?.properties.token).toBe('phc_public')
  })
})

describe('logger', () => {
  afterEach(() => vi.restoreAllMocks())

  it('writes one JSON line without personal data', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    logger.child({ request_id: 'r1', route: '/api/contact' }).info('inquiry received', {
      email: 'a@b.co',
      inquiry_type: 'price',
    })
    const line = JSON.parse(spy.mock.calls[0]?.[0] as string)
    expect(line).toMatchObject({
      level: 'info',
      msg: 'inquiry received',
      request_id: 'r1',
      inquiry_type: 'price',
    })
    expect(line.email).toBeUndefined()
  })

  it('prefers the Railway request ID', () => {
    expect(requestIdFrom(new Headers({ 'x-railway-request-id': 'rw-1' }))).toBe('rw-1')
    expect(requestIdFrom({})).toMatch(/[0-9a-f-]{36}/)
  })
})
