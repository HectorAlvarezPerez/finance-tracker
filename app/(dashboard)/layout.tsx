import { Nav, MobileNav } from "@/components/nav"
import { AIChatWrapper } from "@/components/ai-assistant/ai-chat-wrapper"
import { SettingsProvider } from "@/lib/contexts/settings-context"
import { createServerClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <SettingsProvider userId={user?.id || null}>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
        <AIChatWrapper />
      </div>
    </SettingsProvider>
  )
}

