import type React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"
import { privatePageMetadata } from "@/lib/seo/metadata"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountHeader } from "@/components/account/account-header"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: "seo" })
  return privatePageMetadata(locale, "/account", t("private.account"))
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <AccountSidebar />
          </aside>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <AccountHeader />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
