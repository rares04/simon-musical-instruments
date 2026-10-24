import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const DB_TIMEOUT_MS = 3000

async function checkDatabase(): Promise<void> {
  const payload = await getPayload({ config })
  await Promise.race([
    payload.db.pool.query('SELECT 1'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), DB_TIMEOUT_MS)),
  ])
}

export async function GET() {
  const timestamp = new Date().toISOString()
  try {
    await checkDatabase()
    return NextResponse.json({ status: 'ok', db: 'ok', timestamp })
  } catch {
    return NextResponse.json({ status: 'error', db: 'down', timestamp }, { status: 503 })
  }
}
