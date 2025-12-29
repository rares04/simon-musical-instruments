import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account')
  }

  return session
}
