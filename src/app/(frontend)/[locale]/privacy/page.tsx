import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { LegalDocument } from '@/components/legal-document'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/privacy',
    title: t('privacy.title'),
    description: t('privacy.description'),
  })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'footer' })
  return (
    <LegalDocument locale={locale} doc="privacy" related={{ href: '/terms', label: t('terms') }} />
  )
}
