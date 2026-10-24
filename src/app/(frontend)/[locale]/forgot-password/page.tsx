'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OtpInput } from '@/components/ui/otp-input'
import { TurnstileWidget, turnstileRequired } from '@/components/turnstile-widget'
import { Link, useRouter } from '@/i18n/routing'

type Step = 'request' | 'reset'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()

  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaReset, setCaptchaReset] = useState(0)

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, turnstileToken: captchaToken }),
      })
      setCaptchaReset((n) => n + 1)
      // The token is single-use; the next step renders a fresh challenge.
      setCaptchaToken(null)
      if (!response.ok) {
        setError(t('verifyEmail.errors.genericError'))
        return
      }
      setStep('reset')
    } catch {
      setError(t('verifyEmail.errors.genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8 || password.length > 128) {
      setError(t('register.errors.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMismatch'))
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password, turnstileToken: captchaToken }),
      })
      setCaptchaReset((n) => n + 1)
      setCaptchaToken(null)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (response.status === 400 && data.field === 'password') {
          setError(t('register.errors.passwordTooShort'))
        } else if (response.status === 400 && !data.captcha) {
          setCode('')
          setError(t('forgotPassword.invalidCode'))
        } else {
          setError(t('verifyEmail.errors.genericError'))
        }
        return
      }
      try {
        sessionStorage.setItem('loginEmail', email)
      } catch {
        // Storage unavailable: the user types the email again.
      }
      router.push('/login?reset=true')
    } catch {
      setError(t('verifyEmail.errors.genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="cursor-pointer">
            <h1 className="font-serif text-xl font-bold text-foreground">{t('brandName')}</h1>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-foreground mt-6">
            {t('forgotPassword.title')}
          </h2>
          <p className="text-muted-foreground mt-2">
            {step === 'request'
              ? t('forgotPassword.subtitle')
              : t('forgotPassword.codeSent', { email })}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={requestCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('register.email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />
            <Button
              type="submit"
              size="lg"
              className="w-full h-11 cursor-pointer"
              disabled={isLoading || !email || (turnstileRequired && !captchaToken)}
            >
              {isLoading ? t('verifyEmail.sending') : t('forgotPassword.sendCode')}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('forgotPassword.enterCode')}</Label>
              <OtpInput
                value={code}
                onChange={setCode}
                disabled={isLoading}
                error={Boolean(error)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('forgotPassword.newPassword')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">{t('register.passwordRequirement')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />
            <Button
              type="submit"
              size="lg"
              className="w-full h-11 cursor-pointer"
              disabled={isLoading || code.length !== 6 || (turnstileRequired && !captchaToken)}
            >
              {isLoading ? t('forgotPassword.saving') : t('forgotPassword.resetPassword')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full cursor-pointer"
              disabled={isLoading}
              onClick={() => {
                setCode('')
                setError(null)
                setCaptchaToken(null)
                setStep('request')
              }}
            >
              {t('verifyEmail.resendCode')}
            </Button>
          </form>
        )}

        <p className="text-center text-sm">
          <Link href="/login" className="text-accent hover:underline cursor-pointer">
            {t('verifyEmail.backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  )
}
