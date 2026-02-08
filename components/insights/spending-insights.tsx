"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TrendingDown, Lightbulb, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function SpendingInsights({
  currentSpending,
  topCategory,
  periodLabel,
}: {
  currentSpending: number
  topCategory: { name: string; total: number } | null
  periodLabel: string
}) {
  const insights = [] as Array<{
    type: "warning" | "success" | "info"
    icon: LucideIcon
    title: string
    description: string
  }>

  if (currentSpending > 0) {
    insights.push({
      type: "info",
      icon: TrendingDown,
      title: "Total Spending",
      description: `${formatCurrency(currentSpending)} spent during ${periodLabel}.`,
    })
  } else {
    insights.push({
      type: "success",
      icon: CheckCircle,
      title: "No Spending",
      description: `No expenses recorded during ${periodLabel}.`,
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <Card key={`${insight.title}-${index}`} className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${colorMap[insight.type]}`} />
                <CardTitle className="text-sm sm:text-base">{insight.title}</CardTitle>
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
