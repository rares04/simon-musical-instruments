import type React from 'react'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Noto_Sans_JP, Noto_Sans_KR } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import { ClientProviders } from '@/components/client-providers'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-ja',
  weight: ['400', '500', '700'],
})
const notoKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-ko',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Simon Musical Instruments | Handcrafted String Instruments from Reghin, Romania',
  description:
    'Premium handcrafted violins, violas, cellos, and contrabasses made with naturally-cured wood and traditional varnish in Reghin, Transylvania.',
  icons: {
    icon: [
      {
        url: '/icon-light.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Providing all messages to the client
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${notoJP.variable} ${notoKR.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            {children}
            <Analytics />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
