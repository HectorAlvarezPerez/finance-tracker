"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatMonth } from "@/lib/utils"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import type { Database } from "@/types/database"

type Budget = Database["public"]["Tables"]["budgets"]["Row"] & {
  categories: { name: string; color: string } | null
}

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

export function BudgetsList({
  budgets,
  transactions,
  userId,
}: {
  budgets: Budget[]
  transactions: Transaction[]
  userId: string
}) {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Create your first budget to start tracking your spending
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate spending per category
  const categorySpending = new Map<string, number>()
  transactions.forEach((t) => {
    if (t.category_id) {
      const current = categorySpending.get(t.category_id) || 0
      categorySpending.set(t.category_id, current + Math.abs(t.amount))
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        const spent = budget.category_id ? categorySpending.get(budget.category_id) || 0 : 0
        const remaining = budget.amount_total - spent
        const percentage = (spent / budget.amount_total) * 100
        const status = percentage >= 100 ? "over" : percentage >= 80 ? "near" : "under"

        const StatusIcon =
          status === "over" ? AlertCircle : status === "near" ? AlertTriangle : CheckCircle

        const statusColor =
          status === "over" ? "text-red-600" : status === "near" ? "text-yellow-600" : "text-green-600"

        return (
          <Card key={budget.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {budget.categories?.name || "Overall"}
                </CardTitle>
                <StatusIcon className={`h-5 w-5 ${statusColor}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold">{formatCurrency(spent)}</span>
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold">{formatCurrency(budget.amount_total)}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className={`text-sm font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {percentage.toFixed(0)}% of budget used
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

