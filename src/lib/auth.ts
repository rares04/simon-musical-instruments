import 'server-only'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
// import Facebook from 'next-auth/providers/facebook'
// import Apple from 'next-auth/providers/apple'
import Credentials from 'next-auth/providers/credentials'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User as PayloadUser } from '@/payload-types'
import crypto from 'crypto'
import { hasAdminRole } from '@/access'

const randomPassword = () => crypto.randomBytes(32).toString('hex')

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ['nonce'],
    }),
    // Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    // Apple({
    //   clientId: process.env.APPLE_CLIENT_ID!,
    //   clientSecret: process.env.APPLE_CLIENT_SECRET!,
    // }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = String(credentials.email).trim().toLowerCase()
        const password = String(credentials.password)
        if (password.length > 128) return null

        try {
          const payload = await getPayload({ config })

          // Only verified accounts may sign in with a password. Unverified ones get null here;
          // the login page then asks /api/auth/check-verification what to do.
          const existingUsers = await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
            depth: 0,
          })
          const existingUser = existingUsers.docs[0]
          if (!existingUser || !existingUser.emailVerified) {
            return null
          }

          // Payload checks the password (Local API, so the admin-only REST login rule doesn't apply).
          const { user } = await payload.login({
            collection: 'users',
            data: { email, password },
          })

          if (user) {
            const payloadUser = user as unknown as PayloadUser

            return {
              id: String(payloadUser.id),
              email: payloadUser.email,
              name:
                payloadUser.name ||
                `${payloadUser.firstName || ''} ${payloadUser.lastName || ''}`.trim() ||
                undefined,
              image: payloadUser.image || undefined,
              firstName: payloadUser.firstName || undefined,
              lastName: payloadUser.lastName || undefined,
              phone: payloadUser.phone || undefined,
              roles: payloadUser.roles || ['user'],
              shippingAddress: payloadUser.shippingAddress || undefined,
            }
          }

          return null
        } catch {
          // Login failed (wrong password, etc.)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, create or update user in Payload
      if (account?.provider && account.provider !== 'credentials') {
        // Only trust addresses Google has verified.
        if (!user.email || profile?.email_verified !== true) {
          return false
        }
        const email = user.email.toLowerCase()

        try {
          const payload = await getPayload({ config })

          // Check if user already exists by providerId
          const existingUsers = await payload.find({
            collection: 'users',
            where: {
              and: [
                { provider: { equals: account.provider } },
                { providerId: { equals: account.providerAccountId } },
              ],
            },
            limit: 1,
          })

          if (existingUsers.docs.length > 0) {
            // User exists, update their info if needed
            const existingUser = existingUsers.docs[0]
            await payload.update({
              collection: 'users',
              id: existingUser.id,
              data: {
                name: user.name || existingUser.name || undefined,
                image: user.image || existingUser.image || undefined,
                emailVerified: true,
              },
            })
            // Store Payload user ID for session
            user.id = String(existingUser.id)
          } else {
            // Check if user exists by email (might have credentials account)
            const usersByEmail = await payload.find({
              collection: 'users',
              where: {
                email: { equals: email },
              },
              limit: 1,
              depth: 0,
            })

            if (usersByEmail.docs.length > 0) {
              const existingUser = usersByEmail.docs[0]
              // Admin accounts are never linked automatically.
              if (hasAdminRole(existingUser)) {
                return '/login?error=OAuthAccountNotLinked'
              }
              // Link OAuth to the existing account. Google has just proven the address, so it is
              // now verified. If it wasn't verified before, nobody had proven control of it, so a
              // password set back then is replaced with a random one.
              await payload.update({
                collection: 'users',
                id: existingUser.id,
                data: {
                  provider: account.provider as 'google', // | 'facebook' | 'apple' // Not implemented for now
                  providerId: account.providerAccountId,
                  name: user.name || existingUser.name || undefined,
                  image: user.image || existingUser.image || undefined,
                  emailVerified: true,
                  ...(existingUser.emailVerified
                    ? {}
                    : { password: randomPassword(), otp: null, otpExpiry: null }),
                },
              })
              user.id = String(existingUser.id)
            } else {
              // Create new user with a random password (OAuth users never use it)
              const nameParts = user.name?.split(' ') || []
              const newUser = await payload.create({
                collection: 'users',
                data: {
                  email,
                  password: randomPassword(), // Required by Payload auth collection
                  emailVerified: true,
                  provider: account.provider as 'google', // | 'facebook' | 'apple' // Not implemented for now
                  providerId: account.providerAccountId,
                  name: user.name || undefined,
                  firstName: nameParts[0] || undefined,
                  lastName: nameParts.slice(1).join(' ') || undefined,
                  image: user.image || undefined,
                  roles: ['user'],
                },
              })
              user.id = String(newUser.id)
            }
          }
        } catch (error) {
          console.error('Error syncing OAuth user with Payload:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName || null
        token.lastName = user.lastName || null
        token.phone = user.phone || null
        token.roles = user.roles || undefined
        token.shippingAddress = user.shippingAddress || undefined
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.firstName = (token.firstName as string | null | undefined) || undefined
        session.user.lastName = (token.lastName as string | null | undefined) || undefined
        session.user.phone = (token.phone as string | null | undefined) || undefined
        session.user.roles = (token.roles as string[] | undefined) || undefined
        session.user.shippingAddress = token.shippingAddress as typeof session.user.shippingAddress

        // Fetch fresh user data from Payload to get latest info
        try {
          const payload = await getPayload({ config })
          const payloadUser = await payload.findByID({
            collection: 'users',
            id: Number(token.id),
          })
          if (payloadUser) {
            session.user.name =
              payloadUser.name ||
              `${payloadUser.firstName || ''} ${payloadUser.lastName || ''}`.trim()
            session.user.firstName = payloadUser.firstName || undefined
            session.user.lastName = payloadUser.lastName || undefined
            session.user.phone = payloadUser.phone || undefined
            session.user.image = payloadUser.image || undefined
            session.user.roles = payloadUser.roles || ['user']
            session.user.shippingAddress = payloadUser.shippingAddress || undefined
          }
        } catch {
          // User might not exist in Payload yet, use token data
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
})
