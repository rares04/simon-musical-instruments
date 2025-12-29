"use client"
import { ProfileForm } from "@/components/account/profile-form"
import { AddressManager } from "@/components/account/address-manager"
import { PasswordChangeForm } from "@/components/account/password-change-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            value="personal"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            Saved Addresses
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent cursor-pointer"
          >
            Password
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
