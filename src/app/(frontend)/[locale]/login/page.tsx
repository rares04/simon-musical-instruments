'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthButtons } from '@/components/auth-buttons'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/routing'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setFormError(t('login.errors.invalidCredentials'))
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setFormError(t('login.errors.tryAgain'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="cursor-pointer">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {t('brandName')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t('location')}</p>
          </Link>

          <div className="space-y-4">
            <blockquote className="font-serif text-2xl text-foreground text-balance leading-relaxed">
              &quot;{t('login.quote')}&quot;
            </blockquote>
            <p className="text-sm text-muted-foreground">{t('login.quoteAuthor')}</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="cursor-pointer">
              <h1 className="font-serif text-xl font-bold text-foreground">
                {t('brandName')}
              </h1>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground">{t('login.title')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Error Messages */}
          {(error || formError) && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {formError ||
                (error === 'OAuthAccountNotLinked'
                  ? t('login.errors.oauthNotLinked')
                  : t('login.errors.genericError'))}
            </div>
          )}

          {/* Social Sign In */}
          <div className="space-y-3">
            <AuthButtons mode="signin" callbackUrl={callbackUrl} />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('login.orContinueWith')}
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('labels.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                required
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('labels.password')}</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                required
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('login.noAccount')} </span>
            <Link
              href="/register"
              className="text-accent hover:text-accent/80 font-medium transition-colors cursor-pointer"
            >
              {t('login.createAccount')}
            </Link>
          </div>

          {/* Back to Shop */}
          <div className="pt-6 border-t border-border text-center">
            <Link
              href="/gallery"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ← {tCommon('continueAsGuest')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  const tCommon = useTranslations('common')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">{tCommon('loading')}</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  )
}
