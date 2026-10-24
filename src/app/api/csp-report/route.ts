import { NextResponse } from 'next/server'
import { limitByIp } from '@/lib/rate-limit'

const MAX_BODY = 16 * 1024

/** Keeps origin + path of a URL (no query or fragment, which can carry personal data). */
function originAndPath(value: unknown): string {
  if (typeof value !== 'string' || !value) return '-'
  if (!value.includes('/')) return value.slice(0, 40) // keywords like "inline", "eval"
  try {
    const url = new URL(value, 'https://simoninstruments.com')
    return `${url.origin}${url.pathname}`.slice(0, 200)
  } catch {
    return '-'
  }
}

type Report = Record<string, unknown>

/** Accepts both the legacy `report-uri` format and the Reporting API format. */
function extractReports(body: unknown): Report[] {
  if (Array.isArray(body)) {
    return body
      .map((r) => (r as { body?: Report })?.body)
      .filter((r): r is Report => Boolean(r && typeof r === 'object'))
  }
  const legacy = (body as { 'csp-report'?: Report })?.['csp-report']
  return legacy && typeof legacy === 'object' ? [legacy] : []
}

/**
 * Collects Content-Security-Policy violation reports (the policy is report-only for now) and
 * logs one line per violation: directive, blocked resource and page, without query strings.
 */
export async function POST(request: Request) {
  const limited = limitByIp(request, 'cspReport')
  if (limited) return new NextResponse(null, { status: 204 })

  const text = await request.text().catch(() => '')
  if (!text || text.length > MAX_BODY) return new NextResponse(null, { status: 204 })

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  for (const report of extractReports(body).slice(0, 10)) {
    const directive =
      report['effective-directive'] ??
      report['effectiveDirective'] ??
      report['violated-directive'] ??
      '-'
    const blocked = originAndPath(report['blocked-uri'] ?? report['blockedURL'])
    const page = originAndPath(report['document-uri'] ?? report['documentURL'])
    console.warn(`csp: ${String(directive).slice(0, 40)} blocked ${blocked} on ${page}`)
  }
  return new NextResponse(null, { status: 204 })
}
