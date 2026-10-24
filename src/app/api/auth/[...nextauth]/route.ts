import { handlers } from '@/lib/auth'
import { limitByIp } from '@/lib/rate-limit'

export const { GET } = handlers

// Password sign-ins are rate-limited per IP; other Auth.js POSTs (sign-out, OAuth start) pass through.
export async function POST(req: Request) {
  if (new URL(req.url).pathname.endsWith('/callback/credentials')) {
    const limited = limitByIp(req, 'login')
    if (limited) return limited
  }
  return handlers.POST(req as Parameters<typeof handlers.POST>[0])
}
