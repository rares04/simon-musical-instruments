'use client'

import type React from 'react'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'

export function PasswordChangeForm() {
  const { data: session } = useSession()
  const t = useTranslations('profile.password')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Check if user is OAuth-authenticated (kept for future use)
  const _isOAuthUser = session?.user && !session.user.email?.includes('@')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('mismatch') })
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: t('tooShort') })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: t('success') })
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.error || t('error') })
      }
    } catch (_error) {
      setMessage({ type: 'error', text: t('error') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">{t('newPassword')}</Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">{t('requirement')}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-900 border border-green-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading ? t('changing') : t('changePassword')}
        </Button>
      </form>
    </div>
  )
}
