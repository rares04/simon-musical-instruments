import { DefaultSession } from 'next-auth'
import { User as PayloadUser } from '@/payload-types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      roles?: string[]
      shippingAddress?: PayloadUser['shippingAddress']
    } & DefaultSession['user']
  }

  interface User {
    id: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    roles?: string[]
    shippingAddress?: PayloadUser['shippingAddress']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    roles?: string[]
    shippingAddress?: PayloadUser['shippingAddress']
  }
}
