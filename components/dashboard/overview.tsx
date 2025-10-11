import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react"
import { SpendingChart } from "./spending-chart"

export async function DashboardOverview({ userId }: { userId: string }) {
  const supabase = createServerClient()

  // Get all accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)

  // Get transactions for current month
  const currentMonth = new Date()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    .toISOString()
    .split("T")[0]
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, categories(*)")
    .eq("user_id", userId)
    .gte("date", firstDay)
    .lte("date", lastDay)

  // Calculate totals
  const income = transactions
    ?.filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const expenses = Math.abs(
    transactions
      ?.filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0
  )

  const netCash = income - expenses

  // Calculate account balances (simplified - sum of all transactions per account)
  const accountBalances = new Map<string, number>()
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("account_id, amount")
    .eq("user_id", userId)

  allTransactions?.forEach((t) => {
    const current = accountBalances.get(t.account_id) || 0
    accountBalances.set(t.account_id, current + t.amount)
  })

  const totalBalance = Array.from(accountBalances.values()).reduce((sum, val) => sum + val, 0)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts?.length || 0} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(income)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions?.filter((t) => t.amount > 0).length || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions?.filter((t) => t.amount < 0).length || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netCash >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(netCash)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingChart transactions={transactions || []} />
        </CardContent>
      </Card>
    </>
  )
}

