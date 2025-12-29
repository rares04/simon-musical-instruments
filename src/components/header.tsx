'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartButton } from '@/components/cart-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="text-lg lg:text-xl font-serif font-semibold tracking-tight text-foreground">
              Simon Musical Instruments
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/gallery"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Shop
            </Link>
            <Link
              href="/#instruments"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Instruments
            </Link>
            <Link
              href="/#story"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Our Story
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Contact
            </Link>

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
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}

            <CartButton />
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <CartButton />
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
