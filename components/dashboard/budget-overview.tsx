import { createServerClient } from "@/lib/supabase/server"
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function BudgetOverview({ userId }: { userId: string }) {
  const supabase = createServerClient()
  const t = await getTranslations('budgets')

  // Get current month budgets
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01"

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, categories(name, color)")
    .eq("user_id", userId)
    .eq("month", currentMonth)
    .limit(5)

  if (!budgets || budgets.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <Link
            href="/budgets"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {t('setBudgets')} <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('noBudgetsThisMonth')}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get transactions for each budget category
  const firstDay = currentMonth
  const lastDay = new Date(new Date(currentMonth).getFullYear(), new Date(currentMonth).getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", firstDay)
    .lte("date", lastDay)
    .lt("amount", 0) // Only expenses

  // Calculate spending per category
  const categorySpending = new Map<string, number>()
  transactions?.forEach((t) => {
    if (t.category_id) {
      const current = categorySpending.get(t.category_id) || 0
      categorySpending.set(t.category_id, current + Math.abs(t.amount))
    }
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('title')}</CardTitle>
        <Link
          href="/budgets"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t('viewAll')} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget: any) => {
          const spent = budget.category_id ? categorySpending.get(budget.category_id) || 0 : 0
          const percentage = (spent / budget.amount_total) * 100
          const status = percentage >= 100 ? "over" : percentage >= 80 ? "near" : "under"

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {budget.categories?.name || t('overall')}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(spent)} / {formatCurrency(budget.amount_total)}
                </span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className={
                  status === "over"
                    ? "[&>div]:bg-red-500"
                    : status === "near"
                    ? "[&>div]:bg-yellow-500"
                    : ""
                }
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

