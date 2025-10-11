"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { LogOut } from "lucide-react"
import type { Database } from "@/types/database"

type Settings = Database["public"]["Tables"]["settings"]["Row"]

export function SettingsForm({
  userId,
  currentSettings,
}: {
  userId: string
  currentSettings: Settings | null
}) {
  const [logoutLoading, setLogoutLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('settings')

  const handleLogout = async () => {
    setLogoutLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      router.push("/login")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      })
      setLogoutLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preferences')}</CardTitle>
        <CardDescription>{t('preferencesDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('currency')}</Label>
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="text-sm font-medium">USD 🇺🇸 - US Dollar</span>
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('currencyDesc')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t('locale')}</Label>
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="text-sm font-medium">🇺🇸 English (US)</span>
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('localeDesc')}
            </p>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('accountActions')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('signOut')}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="mt-4 w-full sm:w-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutLoading ? t('loggingOut') : t('logOut')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

