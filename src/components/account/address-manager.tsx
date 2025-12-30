'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/account/empty-state'
import { MapPin, Plus, Trash2, Check } from 'lucide-react'

interface Address {
  id: string
  label: string
  street: string
  apartment?: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export function AddressManager() {
  const t = useTranslations('profile.address')
  const tCommon = useTranslations('common')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [_editingId, _setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'RO',
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    try {
      const response = await fetch('/api/account/profile')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.savedAddresses || [])
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
        setIsAdding(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to add address:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/account/addresses?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find((a) => a.id === id)
      if (!address) return

      const response = await fetch('/api/account/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, isDefault: true }),
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Failed to set default address:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      country: 'RO',
      isDefault: false,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (addresses.length === 0 && !isAdding) {
    return (
      <>
        <EmptyState
          icon={MapPin}
          title={t('noAddresses')}
          description={t('addToFaster')}
          actionLabel={t('addAddress')}
          actionHref="#"
        />
        <Button onClick={() => setIsAdding(true)} className="mt-4 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          {t('addAddress')}
        </Button>
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{address.label}</h3>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    {t('default')}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>{address.street}</p>
              {address.apartment && <p>{address.apartment}</p>}
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>

            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full cursor-pointer bg-transparent"
                onClick={() => handleSetDefault(address.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('setAsDefault')}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Button */}
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          {t('addNewAddress')}
        </Button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">{t('addNewAddress')}</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">{t('addressLabel')} *</Label>
              <Input
                id="label"
                placeholder={t('labelPlaceholder')}
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">{t('streetAddress')} *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartment">{t('apartment')}</Label>
              <Input
                id="apartment"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')} *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t('state')} *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">{t('zip')} *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('country')} *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving} className="cursor-pointer">
                {isSaving ? tCommon('processing') : t('saveAddress')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  resetForm()
                }}
                className="cursor-pointer"
              >
                {tCommon('cancel')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
