import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardWrapper } from "@/components/dashboard/dashboard-wrapper"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetOverview } from "@/components/dashboard/budget-overview"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <DashboardWrapper userId={user.id} />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions userId={user.id} />
        <BudgetOverview userId={user.id} />
      </div>
    </div>
  )
}

