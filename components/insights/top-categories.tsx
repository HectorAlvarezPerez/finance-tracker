"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: { name: string; color: string; type: string } | null
}

export function TopCategories({ transactions }: { transactions: Transaction[] }) {
  // Group by category
  const categoryMap = new Map<string, { total: number; color: string }>()
  
  transactions
    .filter((t) => t.amount < 0 && t.categories)
    .filter((t) => t.categories!.type !== 'income') // Exclude income categories (like salary)
    .forEach((t) => {
      const name = t.categories!.name
      const color = t.categories!.color
      const current = categoryMap.get(name) || { total: 0, color }
      current.total += Math.abs(t.amount)
      categoryMap.set(name, current)
    })

  const total = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.total, 0)

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      total: data.total,
      color: data.color,
      percentage: (data.total / total) * 100,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense data for this month</p>
        ) : (
          topCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(category.total)} ({category.percentage.toFixed(0)}%)
                </span>
              </div>
              <Progress
                value={category.percentage}
                style={{
                  // @ts-ignore
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

