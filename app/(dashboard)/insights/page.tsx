import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NetWorthChart } from "@/components/analytics/net-worth-chart"
import { IncomeVsExpensesChart } from "@/components/analytics/income-vs-expenses-chart"
import { ExpensesByCategoryChart } from "@/components/analytics/expenses-by-category-chart"
import { MonthlyTrendsChart } from "@/components/analytics/monthly-trends-chart"
import { SpendingInsights } from "@/components/insights/spending-insights"
import { TopCategories } from "@/components/insights/top-categories"

export default async function InsightsPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get all transactions (last 12 months for better analytics)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  const startDate = twelveMonthsAgo.toISOString().split("T")[0]

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .order("date", { ascending: true })

  // Get all accounts for net worth calculation
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)

  // Get current month transactions for insights
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
    .eq("user_id", user.id)
    .gte("date", firstDay)
    .lte("date", lastDay)

  // Get previous 6 months for comparison
  const sixMonthsAgo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 6, 1)
    .toISOString()
    .split("T")[0]

  const { data: historicalTransactions } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", user.id)
    .gte("date", sixMonthsAgo)
    .lt("date", firstDay)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your financial health and spending patterns
        </p>
      </div>

      {/* Net Worth Over Time */}
      <NetWorthChart 
        transactions={allTransactions || []} 
        accounts={accounts || []}
      />

      {/* Income vs Expenses and Monthly Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeVsExpensesChart transactions={allTransactions || []} />
        <MonthlyTrendsChart transactions={allTransactions || []} />
      </div>

      {/* Expenses by Category */}
      <ExpensesByCategoryChart transactions={allTransactions || []} />

      {/* Legacy Insights */}
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Current Month Insights</h2>
        
        <SpendingInsights
          currentTransactions={currentTransactions || []}
          historicalTransactions={historicalTransactions || []}
        />

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <TopCategories transactions={currentTransactions || []} />
        </div>
      </div>
    </div>
  )
}

