'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Profile', href: '/account/profile', icon: User },
]

export function AccountSidebar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
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
          Sign Out
        </Button>
      </div>
    </div>
  )
}
