import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { privatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'auth' })
  return privatePageMetadata(locale, '/forgot-password', t('forgotPassword.title'))
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
