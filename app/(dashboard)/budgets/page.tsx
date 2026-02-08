import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BudgetsDashboard } from "@/components/budgets/budgets-dashboard"

export const dynamic = "force-dynamic"

export default async function BudgetsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <BudgetsDashboard userId={user.id} />
}
