"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingDown, Lightbulb, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { compareValues } from "@/lib/insights/helpers"

export function SpendingInsights({
  currentSpending,
  previousSpending,
  topCategory,
  periodLabel,
  previousPeriodLabel,
}: {
  currentSpending: number
  previousSpending: number
  topCategory: { name: string; total: number } | null
  periodLabel: string
  previousPeriodLabel: string
}) {
  const comparison = compareValues(currentSpending, previousSpending)

  const insights = [] as Array<{
    type: "warning" | "success" | "info"
    icon: typeof AlertCircle
    title: string
    description: string
  }>

  if (comparison.delta > 0) {
    insights.push({
      type: "warning",
      icon: AlertCircle,
      title: "Spending Increased",
      description: `${periodLabel} is ${formatCurrency(comparison.delta)} above ${previousPeriodLabel}${comparison.deltaPct === null ? "" : ` (${comparison.deltaPct.toFixed(1)}%)`}.`,
    })
  } else if (comparison.delta < 0) {
    insights.push({
      type: "success",
      icon: CheckCircle,
      title: "Spending Reduced",
      description: `${periodLabel} is ${formatCurrency(Math.abs(comparison.delta))} below ${previousPeriodLabel}${comparison.deltaPct === null ? "" : ` (${Math.abs(comparison.deltaPct).toFixed(1)}%)`}.`,
    })
  } else {
    insights.push({
      type: "info",
      icon: TrendingDown,
      title: "Stable Spending",
      description: `Spending is flat vs ${previousPeriodLabel}.`,
    })
  }

  if (topCategory) {
    insights.push({
      type: "info",
      icon: Lightbulb,
      title: `Top Category: ${topCategory.name}`,
      description: `${formatCurrency(topCategory.total)} spent in this category during ${periodLabel}.`,
    })
  }

  const colorMap: Record<string, string> = {
    warning: "text-yellow-600",
    success: "text-green-600",
    info: "text-blue-600",
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <Card key={`${insight.title}-${index}`} className="border-border/60 shadow-sm">
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
