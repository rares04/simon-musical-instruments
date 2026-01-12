'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthButtons } from '@/components/auth-buttons'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/routing'

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMismatch'))
      return
    }

    if (password.length < 8) {
      setError(t('register.errors.passwordTooShort'))
      return
    }

    if (!termsAccepted) {
      setError(t('register.errors.termsRequired'))
      return
    }

    setIsLoading(true)

    try {
      // Create user via Payload API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          provider: 'credentials',
          roles: ['user'],
          emailVerified: false, // User needs to verify email
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (data.errors?.[0]?.message?.includes('email')) {
          setError(t('register.errors.emailExists'))
        } else {
          setError(data.errors?.[0]?.message || t('register.errors.registrationFailed'))
        }
        return
      }

      // Send OTP to user's email
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      if (!otpResponse.ok) {
        // User was created but OTP failed - still redirect to verify page
        console.error('Failed to send OTP email')
      }

      // Redirect to verify email page with email and password (base64 encoded for auto-login after verification)
      const encodedPassword = btoa(password)
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&p=${encodeURIComponent(encodedPassword)}`,
      )
    } catch {
      setError(t('register.errors.genericError'))
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
            <h1 className="font-serif text-2xl font-bold text-foreground">{t('brandName')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('location')}</p>
          </Link>

          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {t('register.whyCreateAccount')}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{t('register.benefits.trackOrders')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{t('register.benefits.savePreferences')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{t('register.benefits.exclusiveUpdates')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{t('register.benefits.personalizedRecs')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="cursor-pointer">
              <h1 className="font-serif text-xl font-bold text-foreground">{t('brandName')}</h1>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground">{t('register.title')}</h2>
            <p className="text-muted-foreground mt-2">{t('register.subtitle')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Social Sign Up */}
          <div className="space-y-3">
            <AuthButtons mode="signup" callbackUrl="/" />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('register.orRegisterWith')}
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('register.firstName')}</Label>
                <Input
                  id="firstName"
                  placeholder="Paul"
                  required
                  className="mt-1.5"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t('register.lastName')}</Label>
                <Input
                  id="lastName"
                  placeholder="Simon"
                  required
                  className="mt-1.5"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">{t('register.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {t('register.passwordRequirement')}
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="mt-1.5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                {t('register.termsAgreement')}{' '}
                <Link href="/terms" className="text-accent hover:text-accent/80 cursor-pointer">
                  {t('register.termsOfService')}
                </Link>{' '}
                {t('register.and')}{' '}
                <Link href="/privacy" className="text-accent hover:text-accent/80 cursor-pointer">
                  {t('register.privacyPolicy')}
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? t('register.creatingAccount') : t('register.createAccount')}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('register.haveAccount')} </span>
            <Link
              href="/login"
              className="text-accent hover:text-accent/80 font-medium transition-colors cursor-pointer"
            >
              {t('register.signIn')}
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
