"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Database } from "@/types/database"

type Settings = Database["public"]["Tables"]["settings"]["Row"]

export function SettingsForm({
  userId,
  currentSettings,
}: {
  userId: string
  currentSettings: Settings | null
}) {
  const t = useTranslations('settings')

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
              <span className="text-sm font-medium">EUR 🇪🇺 - Euro</span>
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
      </CardContent>
    </Card>
  )
}

