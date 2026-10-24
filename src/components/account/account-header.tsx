'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X, LayoutDashboard, Package, User, LogOut, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

// Labels are keys in the `account` namespace.
const navigation = [
  { label: 'dashboardLink', href: '/account', icon: LayoutDashboard },
  { label: 'orders', href: '/account/orders', icon: Package },
  { label: 'profile', href: '/account/profile', icon: User },
] as const

export function AccountHeader() {
  const [isOpen, setIsOpen] = useState(false)
  // Locale-free path (/account/orders), so it matches the hrefs below.
  const pathname = usePathname()
  const t = useTranslations('account')
  const tNav = useTranslations('navigation')

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/gallery"
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {tNav('shop')}
          </Link>
        <h1 className="font-serif text-2xl font-bold text-foreground">{t('title')}</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
          aria-label={isOpen ? tNav('closeMenu') : tNav('openMenu')}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {t(item.label)}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border mt-4 pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              {tNav('signOut')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
