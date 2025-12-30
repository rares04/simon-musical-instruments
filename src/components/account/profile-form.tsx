'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'

export function ProfileForm() {
  const { data: session } = useSession()
  const t = useTranslations('profile.form')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/account/profile')
        if (response.ok) {
          const data = await response.json()
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsFetching(false)
      }
    }

    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: t('updateSuccess') })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || t('updateError') })
      }
    } catch (_error) {
      setMessage({ type: 'error', text: t('updateError') })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">
            {t('emailChangeNote')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          {isLoading ? t('saving') : t('saveChanges')}
        </Button>
      </form>
    </div>
  )
}
