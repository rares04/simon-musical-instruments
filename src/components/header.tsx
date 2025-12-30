'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Menu, User, LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartButton } from '@/components/cart-button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { OrderNotificationDropdown } from '@/components/order-notification-dropdown'
import { ReservationSlotIndicator } from '@/components/reservation-slot-indicator'
import { Link } from '@/i18n/routing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reservationCount, setReservationCount] = useState(0)
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const t = useTranslations('navigation')

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Fetch reservation count for authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      setReservationCount(0)
      return
    }

    async function fetchReservationCount() {
      try {
        const response = await fetch('/api/account/reservation-count')
        if (response.ok) {
          const data = await response.json()
          setReservationCount(data.count || 0)
        }
      } catch (error) {
        console.error('Failed to fetch reservation count:', error)
      }
    }

    fetchReservationCount()
  }, [isAuthenticated])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="text-lg lg:text-xl font-serif font-semibold tracking-tight text-foreground">
              Simon Musical Instruments
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/gallery"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('shop')}
            </Link>
            <Link
              href="/#story"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('about')}
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('faq')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t('contact')}
            </Link>

            <LanguageSwitcher variant="header" />

            {isAuthenticated && reservationCount > 0 && (
              <ReservationSlotIndicator count={reservationCount} variant="header" />
            )}

            {isAuthenticated && <OrderNotificationDropdown />}

            {isAuthenticated && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                        unoptimized
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name || session.user.email}
                    </p>
                    {session.user.name && (
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      {t('myAccount')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      {t('myOrders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  {t('signIn')}
                </Button>
              </Link>
            )}

            <CartButton />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher variant="header" />
            {isAuthenticated && <OrderNotificationDropdown />}
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <CartButton />
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/gallery"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            >
              {t('shop')}
            </Link>
            <Link
              href="/#story"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            >
              {t('about')}
            </Link>
            <Link
              href="/faq"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            >
              {t('faq')}
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            >
              {t('contact')}
            </Link>

            {/* Divider */}
            <div className="h-px bg-border/60 my-2" />

            {isAuthenticated && session?.user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {session.user.name || session.user.email}
                  </p>
                  {session.user.name && (
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  )}
                </div>
                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
                >
                  {t('myAccount')}
                </Link>
                <Link
                  href="/account/orders"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
                >
                  {t('myOrders')}
                </Link>
                {reservationCount > 0 && (
                  <div className="px-4 py-2">
                    <ReservationSlotIndicator count={reservationCount} variant="account" />
                  </div>
                )}
                <button
                  onClick={() => {
                    closeMobileMenu()
                    signOut({ callbackUrl: '/' })
                  }}
                  className="px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('signOut')}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 rounded-md transition-colors cursor-pointer text-center"
              >
                {t('signIn')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
