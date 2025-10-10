"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useSettings } from "@/lib/contexts/settings-context"
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
  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [currency, setCurrency] = useState(currentSettings?.default_currency || "USD")
  const [locale, setLocale] = useState(currentSettings?.locale || "en-US")
  const router = useRouter()
  const { toast } = useToast()
  const { refreshSettings } = useSettings()
  const supabase = createBrowserClient()
  const t = useTranslations('settings')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (currentSettings) {
        // Update existing settings
        const { error } = await supabase
          .from("settings")
          .update({
            default_currency: currency,
            locale,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (error) throw error
      } else {
        // Insert new settings
        const { error } = await supabase.from("settings").insert({
          user_id: userId,
          default_currency: currency,
          locale,
        })

        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Settings updated successfully. Refresh the page to see changes.",
      })

      // Refresh settings context
      await refreshSettings()
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">{t('currency')}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD 🇺🇸 - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR 🇪🇺 - Euro</SelectItem>
                <SelectItem value="GBP">GBP 🇬🇧 - British Pound</SelectItem>
                <SelectItem value="JPY">JPY 🇯🇵 - Japanese Yen</SelectItem>
                <SelectItem value="CAD">CAD 🇨🇦 - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD 🇦🇺 - Australian Dollar</SelectItem>
                <SelectItem value="CHF">CHF 🇨🇭 - Swiss Franc</SelectItem>
                <SelectItem value="CNY">CNY 🇨🇳 - Chinese Yuan</SelectItem>
                <SelectItem value="MXN">MXN 🇲🇽 - Mexican Peso</SelectItem>
                <SelectItem value="BRL">BRL 🇧🇷 - Brazilian Real</SelectItem>
                <SelectItem value="ARS">ARS 🇦🇷 - Argentine Peso</SelectItem>
                <SelectItem value="COP">COP 🇨🇴 - Colombian Peso</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('currencyDesc')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locale">{t('locale')}</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                <SelectItem value="en-GB">🇬🇧 English (UK)</SelectItem>
                <SelectItem value="es-ES">🇪🇸 Español (España)</SelectItem>
                <SelectItem value="es-MX">🇲🇽 Español (México)</SelectItem>
                <SelectItem value="es-AR">🇦🇷 Español (Argentina)</SelectItem>
                <SelectItem value="fr-FR">🇫🇷 Français</SelectItem>
                <SelectItem value="de-DE">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                <SelectItem value="it-IT">🇮🇹 Italiano</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('localeDesc')}
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? t('saving') : t('saveChanges')}
          </Button>
        </form>

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

