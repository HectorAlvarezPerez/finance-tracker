"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingDown, Lightbulb, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: { name: string; color: string } | null
}

export function SpendingInsights({
  currentTransactions,
  historicalTransactions,
}: {
  currentTransactions: Transaction[]
  historicalTransactions: Transaction[]
}) {
  // Calculate current month spending
  const currentSpending = Math.abs(
    currentTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  )

  // Calculate historical average
  const monthlyTotals = new Map<string, number>()
  historicalTransactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const month = t.date.substring(0, 7)
      const current = monthlyTotals.get(month) || 0
      monthlyTotals.set(month, current + Math.abs(t.amount))
    })

  const historicalAvg =
    monthlyTotals.size > 0
      ? Array.from(monthlyTotals.values()).reduce((sum, val) => sum + val, 0) / monthlyTotals.size
      : 0

  const percentageDiff =
    historicalAvg > 0 ? ((currentSpending - historicalAvg) / historicalAvg) * 100 : 0

  const isNormal = Math.abs(percentageDiff) <= 20

  // Find top spending categories
  const categorySpending = new Map<string, { total: number; count: number }>()
  currentTransactions
    .filter((t) => t.amount < 0 && t.categories)
    .forEach((t) => {
      const name = t.categories!.name
      const current = categorySpending.get(name) || { total: 0, count: 0 }
      current.total += Math.abs(t.amount)
      current.count += 1
      categorySpending.set(name, current)
    })

  const topCategories = Array.from(categorySpending.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3)

  const insights = []

  // Spending comparison insight
  if (percentageDiff > 20) {
    insights.push({
      type: "warning",
      icon: AlertCircle,
      title: "Spending Above Average",
      description: `You're spending ${percentageDiff.toFixed(0)}% more than your average. Consider reviewing your budget.`,
    })
  } else if (percentageDiff < -20) {
    insights.push({
      type: "success",
      icon: CheckCircle,
      title: "Great Job!",
      description: `You're spending ${Math.abs(percentageDiff).toFixed(0)}% less than your average. Keep it up!`,
    })
  } else {
    insights.push({
      type: "info",
      icon: TrendingDown,
      title: "Normal Spending",
      description: "Your spending is within your typical range.",
    })
  }

  // Top category insight
  if (topCategories.length > 0) {
    const [topCategory, data] = topCategories[0]
    const avgPerTransaction = data.total / data.count
    insights.push({
      type: "info",
      icon: Lightbulb,
      title: `Top Category: ${topCategory}`,
      description: `You've spent ${formatCurrency(data.total)} across ${data.count} transactions (avg ${formatCurrency(avgPerTransaction)}).`,
    })
  }

  // Recommendation
  if (percentageDiff > 10 && topCategories.length > 0) {
    const [topCategory] = topCategories[0]
    insights.push({
      type: "recommendation",
      icon: Lightbulb,
      title: "Recommendation",
      description: `Consider setting a budget for ${topCategory} to better control your spending.`,
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, i) => {
        const Icon = insight.icon
        const colorMap: Record<string, string> = {
          warning: "text-yellow-600",
          success: "text-green-600",
          info: "text-blue-600",
          recommendation: "text-purple-600",
        }

        return (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${colorMap[insight.type]}`} />
                <CardTitle className="text-base">{insight.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

