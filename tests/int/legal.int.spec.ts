import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fillPlaceholders, LEGAL_PLACEHOLDERS, LINK_PATTERN } from '@/lib/legal/placeholders'

const LOCALES = ['en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'] as const

function load(locale: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8'))
}

/** Key paths and array lengths, so translations must keep the exact structure of English. */
function shape(value: unknown, at = ''): string[] {
  if (Array.isArray(value)) {
    return [`${at}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${at}[${i}]`))]
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      // Section ids are anchors and must not be translated.
      k === 'id' ? [`${at}.id=${String(v)}`] : shape(v, `${at}.${k}`),
    )
  }
  return [at]
}

function strings(value: unknown, at = ''): [string, string][] {
  if (typeof value === 'string') return [[at, value]]
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${at}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${at}.${k}`))
  }
  return []
}

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(' ')

const pick = (m: Record<string, unknown>) => {
  const footer = m.footer as Record<string, unknown>
  const seo = m.seo as Record<string, unknown>
  const contact = m.contact as Record<string, unknown>
  return {
    legal: m.legal,
    footer: { legal: footer.legal, privacy: footer.privacy, terms: footer.terms },
    seo: { privacy: seo.privacy, terms: seo.terms },
    mapConsent: contact.mapConsent,
  }
}

describe('legal pages messages', () => {
  const en = pick(load('en'))

  it.each(LOCALES)('%s has the same structure as English', (locale) => {
    expect(shape(pick(load(locale)))).toEqual(shape(en))
  })

  it.each(LOCALES)('%s keeps the same placeholders as English', (locale) => {
    const enStrings = new Map(strings(en))
    for (const [path, text] of strings(pick(load(locale)))) {
      expect(text.trim(), path).not.toBe('')
      expect(placeholders(text), path).toBe(placeholders(enStrings.get(path) ?? ''))
    }
  })

  it('uses only known placeholders in the documents', () => {
    const known = new Set([...LEGAL_PLACEHOLDERS, 'date'])
    for (const [path, text] of strings(en.legal)) {
      for (const name of text.match(/\{(\w+)\}/g) ?? []) {
        expect(known.has(name.slice(1, -1) as never), `${path}: ${name}`).toBe(true)
      }
    }
  })
})

describe('LINK_PATTERN', () => {
  const links = (m: Record<string, unknown>) =>
    strings(m.legal)
      .flatMap(([, text]) => text.match(LINK_PATTERN) ?? [])
      .sort()
  const enLinks = links(load('en'))

  it.each(LOCALES)('%s links exactly the same URLs as English', (locale) => {
    expect(enLinks.length).toBeGreaterThan(0)
    expect(links(load(locale))).toEqual(enLinks)
  })

  it('stops at full-width and sentence punctuation', () => {
    expect('（https://anpc.ro）に'.match(LINK_PATTERN)).toEqual(['https://anpc.ro'])
    expect('see https://anpc.ro/ce-este-sal/).'.match(LINK_PATTERN)).toEqual([
      'https://anpc.ro/ce-este-sal/',
    ])
    expect('{email}宛て'.replace('{email}', 'a.b@example.com').match(LINK_PATTERN)).toEqual([
      'a.b@example.com',
    ])
  })
})

describe('fillPlaceholders', () => {
  it('replaces known names and leaves unknown ones', () => {
    expect(fillPlaceholders('{a} and {b}', { a: 'x' })).toBe('x and {b}')
  })
})
