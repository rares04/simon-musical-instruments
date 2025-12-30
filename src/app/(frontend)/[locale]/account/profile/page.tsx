"use client"
import { useTranslations } from 'next-intl'
import { ProfileForm } from "@/components/account/profile-form"
import { AddressManager } from "@/components/account/address-manager"
import { PasswordChangeForm } from "@/components/account/password-change-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const t = useTranslations('account.profilePage')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            value="personal"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            {t('personalInfo')}
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            {t('savedAddresses')}
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            {t('password')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <AddressManager />
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <PasswordChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
