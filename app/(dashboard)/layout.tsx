import { Nav, MobileNav } from "@/components/nav"
import { AIChatWrapper } from "@/components/ai-assistant/ai-chat-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
      <AIChatWrapper />
    </div>
  )
}

