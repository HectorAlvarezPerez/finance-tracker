import { Nav, MobileNav } from "@/components/layout/nav"
import { AIChatWrapper } from "@/components/ai-assistant/ai-chat-wrapper"
import { SettingsProvider } from "@/lib/contexts/settings-context"
import { I18nProvider } from "@/lib/i18n/provider"
import { InitDefaultData } from "@/components/providers/init-default-data"
import { createServerClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user settings to determine locale
  const { data: settings } = await supabase
    .from('settings')
    .select('locale')
    .eq('user_id', user?.id || '')
    .single()

  return (
    <SettingsProvider userId={user?.id || null}>
      <I18nProvider>
        <div className="min-h-screen flex flex-col">
          {/* Disabled to avoid rate limit issues - categories can be created manually */}
          {/* {user && <InitDefaultData userId={user.id} locale={settings?.locale || 'en-US'} />} */}
          <Nav />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <MobileNav />
          <AIChatWrapper />
        </div>
      </I18nProvider>
    </SettingsProvider>
  )
}

