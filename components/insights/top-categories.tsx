"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

type TopCategoryItem = {
  key: string
  name: string
  color: string
  total: number
  percentage: number
}

export function TopCategories({ items }: { items: TopCategoryItem[] }) {
  const topItems = items.slice(0, 5)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense data for this month</p>
        ) : (
          topItems.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(category.total)} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={category.percentage}
                style={{
                  // @ts-ignore custom css var for progress color
                  "--progress-color": category.color,
                }}
                className="[&>div]:bg-[var(--progress-color)]"
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
