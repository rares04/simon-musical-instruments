import { describe, expect, it } from 'vitest'
import { buildCsp, securityHeaders } from '../../security-headers.mjs'

const scriptSrc = (csp: string) => csp.split('; ').find((d) => d.startsWith('script-src ')) ?? ''

describe('Content-Security-Policy', () => {
  it("never allows 'unsafe-eval' outside development", () => {
    for (const env of ['production', 'test', undefined]) {
      expect(buildCsp(env)).not.toContain('unsafe-eval')
    }
  })

  it("allows 'unsafe-eval' in script-src only for next dev", () => {
    const csp = buildCsp('development')
    expect(scriptSrc(csp)).toContain("'unsafe-eval'")
    expect(csp.match(/unsafe-eval/g)).toHaveLength(1)
  })

  it('is otherwise identical in development and production', () => {
    expect(buildCsp('development').replace(" 'unsafe-eval'", '')).toBe(buildCsp('production'))
  })

  it('is sent as an enforcing header in production', () => {
    const headers = securityHeaders('production')
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')
    expect(csp?.value).toBe(buildCsp('production'))
    expect(headers.some((h) => h.key === 'Content-Security-Policy-Report-Only')).toBe(false)
    expect(csp?.value).toContain("frame-ancestors 'none'")
    expect(csp?.value).toContain("object-src 'none'")
  })
})
