import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { SettingsForm } from "@/components/settings/settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const t = await getTranslations('settings')

  // Get current user (not session - for security)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('accountInfo')}</CardTitle>
            <CardDescription>{t('accountDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">{t('email')}</p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{t('userId')}</p>
              <p className="text-sm text-muted-foreground font-mono text-xs">
                {user.id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
            <CardDescription>Manage automated rules and behaviors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium">Transaction Rules</p>
                <p className="text-sm text-muted-foreground">
                  Automatically categorize transactions based on patterns
                </p>
              </div>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/settings/rules">Manage Rules</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SettingsForm userId={user.id} currentSettings={settings} />
      </div>
    </div>
  )
}
