import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SpendingInsights } from "@/components/insights/spending-insights"
import { MonthlyComparison } from "@/components/insights/monthly-comparison"
import { TopCategories } from "@/components/insights/top-categories"

export default async function InsightsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get current month transactions
  const currentMonth = new Date()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    .toISOString()
    .split("T")[0]
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]

  const { data: currentTransactions } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", session.user.id)
    .gte("date", firstDay)
    .lte("date", lastDay)

  // Get previous 6 months for comparison
  const sixMonthsAgo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 6, 1)
    .toISOString()
    .split("T")[0]

  const { data: historicalTransactions } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", session.user.id)
    .gte("date", sixMonthsAgo)
    .lt("date", firstDay)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">
          Analyze your spending patterns and get recommendations
        </p>
      </div>

      <SpendingInsights
        currentTransactions={currentTransactions || []}
        historicalTransactions={historicalTransactions || []}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyComparison
          currentTransactions={currentTransactions || []}
          historicalTransactions={historicalTransactions || []}
        />
        <TopCategories transactions={currentTransactions || []} />
      </div>
    </div>
  )
}

