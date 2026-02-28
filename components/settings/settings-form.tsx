"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Languages, Check } from "lucide-react"
import type { Database } from "@/types/database"

type Settings = Database["public"]["Tables"]["settings"]["Row"]

const LANGUAGES = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
]

export function SettingsForm({
  userId,
  currentSettings,
}: {
  userId: string
  currentSettings: Settings | null
}) {
  const t = useTranslations("settings")
  const router = useRouter()
  const { toast } = useToast()
  const [selectedLocale, setSelectedLocale] = useState(currentSettings?.locale || "en")
  const [loading, setLoading] = useState(false)

  const handleLocaleChange = async (newLocale: string) => {
    setLoading(true)
    setSelectedLocale(newLocale)

    try {
      const response = await fetch("/api/settings/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: newLocale }),
      })

      if (!response.ok) {
        throw new Error("Failed to update locale")
      }

      toast({
        title: t("success"),
        description: t("localeUpdated"),
      })

      // Refresh the page to apply new locale
      setTimeout(() => {
        router.refresh()
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("Error updating locale:", error)
      toast({
        title: t("error"),
        description: t("localeUpdateError"),
        variant: "destructive",
      })
      setSelectedLocale(currentSettings?.locale || "en")
    } finally {
      setLoading(false)
    }
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.value === selectedLocale)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("preferences")}</CardTitle>
        <CardDescription>{t("preferencesDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("currency")}</Label>
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <span className="text-sm font-medium">EUR 🇪🇺 - Euro</span>
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <p className="text-xs text-muted-foreground">{t("currencyDesc")}</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t("language")}
            </Label>
            <Select value={selectedLocale} onValueChange={handleLocaleChange} disabled={loading}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {currentLanguage && (
                    <span className="flex items-center gap-2">
                      <span>{currentLanguage.flag}</span>
                      <span>{currentLanguage.label}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {selectedLocale === lang.value && (
                        <Check className="h-4 w-4 ml-auto text-primary" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("languageDesc")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
