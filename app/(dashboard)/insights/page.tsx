import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InsightsDashboard } from "@/components/insights/insights-dashboard"

export const dynamic = 'force-dynamic'

export default async function InsightsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <InsightsDashboard userId={user.id} />
}
