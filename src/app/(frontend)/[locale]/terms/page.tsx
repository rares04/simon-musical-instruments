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
    path: '/terms',
    title: t('terms.title'),
    description: t('terms.description'),
  })
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'footer' })
  return (
    <LegalDocument
      locale={locale}
      doc="terms"
      related={{ href: '/privacy', label: t('privacy') }}
    />
  )
}
