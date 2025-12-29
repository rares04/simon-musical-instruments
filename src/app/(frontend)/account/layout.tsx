import type React from "react"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountHeader } from "@/components/account/account-header"

export const metadata = {
  title: "My Account - Simon Musical Instruments",
  description: "Manage your account, orders, and preferences",
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
