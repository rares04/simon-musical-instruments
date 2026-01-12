'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/ui/otp-input'
import { Link } from '@/i18n/routing'
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('auth')

  const email = searchParams.get('email') || ''
  const encodedPassword = searchParams.get('p') || ''
  // Decode base64 password for auto-login after verification
  const password = encodedPassword
    ? (() => {
        try {
          return atob(encodedPassword)
        } catch {
          return ''
        }
      })()
    : ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/register')
    }
  }, [email, router])

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !success) {
      handleVerify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) {
      setError(t('verifyEmail.errors.invalidOtp'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.expired) {
          setError(t('verifyEmail.errors.expired'))
        } else {
          setError(data.error || t('verifyEmail.errors.verificationFailed'))
        }
        // Clear OTP on error for retry
        setOtp('')
        return
      }

      setSuccess(true)

      // Auto sign in after verification if password is available
      if (password) {
        setTimeout(async () => {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            // Verification succeeded but auto-login failed, redirect to login
            router.push('/login?verified=true')
          } else {
            router.push('/')
            router.refresh()
          }
        }, 1500)
      } else {
        // No password available, redirect to login
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 2000)
      }
    } catch {
      setError(t('verifyEmail.errors.genericError'))
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }, [otp, email, password, t, router])

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.alreadyVerified) {
          // User is already verified, redirect to login
          router.push('/login?verified=true')
          return
        }
        setError(data.error || t('verifyEmail.errors.resendFailed'))
        return
      }

      // Start 60 second cooldown
      setResendCooldown(60)
    } catch {
      setError(t('verifyEmail.errors.genericError'))
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="cursor-pointer">
            <h1 className="font-serif text-2xl font-bold text-foreground">{t('brandName')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('location')}</p>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {t('verifyEmail.checkInbox')}
                </h3>
                <p className="text-muted-foreground">{t('verifyEmail.weSentCode')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Verification Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="cursor-pointer">
              <h1 className="font-serif text-xl font-bold text-foreground">{t('brandName')}</h1>
            </Link>
          </div>

          {success ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {t('verifyEmail.success.title')}
                </h2>
                <p className="text-muted-foreground mt-2">{t('verifyEmail.success.subtitle')}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('verifyEmail.success.redirecting')}</span>
              </div>
            </div>
          ) : (
            // Verification Form
            <>
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 lg:hidden">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {t('verifyEmail.title')}
                </h2>
                <p className="text-muted-foreground mt-2">{t('verifyEmail.subtitle')}</p>
                <p className="text-sm text-accent mt-4 font-medium">{email}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-6">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                  error={Boolean(error)}
                  autoFocus
                />

                <p className="text-center text-sm text-muted-foreground">
                  {t('verifyEmail.enterCode')}
                </p>
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={otp.length !== 6 || isLoading}
                className="w-full h-12 text-base"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {t('verifyEmail.verifying')}
                  </>
                ) : (
                  t('verifyEmail.verify')
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">{t('verifyEmail.didntReceive')}</p>
                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isResending || resendCooldown > 0}
                  className="text-accent hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {t('verifyEmail.sending')}
                    </>
                  ) : resendCooldown > 0 ? (
                    t('verifyEmail.resendIn', { seconds: resendCooldown })
                  ) : (
                    t('verifyEmail.resendCode')
                  )}
                </Button>
              </div>

              {/* Back to Sign In */}
              <div className="pt-6 border-t border-border text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  ← {t('verifyEmail.backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
