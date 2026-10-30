import type React from 'react'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ClientProviders } from '@/components/client-providers'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import '../globals.css'

// Variable names must match the `@theme` font stacks in globals.css.
// `subsets` only controls preloading: other ranges (Romanian ă ș ț, Greek) still load on demand.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// Same family name, so the browser pairs this with inter. Not preloaded: only the testimonials and
// a few other lines are italic, so pages without them never fetch it.
const interItalic = Inter({ style: 'italic', preload: false, variable: '--font-inter-italic' })
// Playfair has no Greek glyphs. Without the metric-adjusted Times fallback, Greek headings fall
// through to the regular serif stack instead of an enlarged Times New Roman.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  adjustFontFallback: false,
})
// Same family name, so the browser pairs these italic faces with `playfair`. Not preloaded:
// only a few home-page lines are italic.
const playfairItalic = Playfair_Display({
  style: 'italic',
  preload: false,
  variable: '--font-playfair-italic',
  adjustFontFallback: false,
})
// No CJK web font: /ja and /ko use the OS font (Hiragino, Yu Gothic, Malgun Gothic, …), picked by
// <html lang>. A next/font CJK face would add its @font-face CSS to every locale's pages.

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
    <html lang={locale} className={cn(inter.variable, interItalic.variable, playfair.variable, playfairItalic.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
