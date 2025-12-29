'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer'
}

export function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'header' ? (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden lg:inline text-sm">{locale.toUpperCase()}</span>
          </Button>
        ) : (
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
            <Globe className="h-4 w-4" />
            <span>{localeNames[locale]}</span>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-lg">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-lg">{localeFlags[loc]}</span>
                <span className="text-sm">{localeNames[loc]}</span>
              </div>
              {locale === loc && <Check className="h-4 w-4 text-accent" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
