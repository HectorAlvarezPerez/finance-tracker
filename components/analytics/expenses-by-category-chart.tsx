"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
}

interface ExpensesByCategoryChartProps {
  transactions: Transaction[]
}

export function ExpensesByCategoryChart({ transactions }: ExpensesByCategoryChartProps) {
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  // Get top 5 expense categories
  const categoryTotals = new Map<string, { name: string; color: string; total: number }>()

  transactions
    .filter((t) => t.amount < 0 && t.categories !== null)
    .forEach((t) => {
      const categoryName = t.categories!.name
      const categoryColor = t.categories!.color
      const current = categoryTotals.get(categoryName) || {
        name: categoryName,
        color: categoryColor,
        total: 0
      }
      current.total += Math.abs(t.amount)
      categoryTotals.set(categoryName, current)
    })

  const topCategories = Array.from(categoryTotals.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((c) => c.name)

  // Group by month and category
  const monthlyData = new Map<string, Record<string, number>>()

  transactions
    .filter((t) => t.amount < 0 && t.categories !== null)
    .forEach((t) => {
      const month = t.date.substring(0, 7)
      const categoryName = t.categories!.name

      // Only include top categories
      if (!topCategories.includes(categoryName)) return

      const monthData = monthlyData.get(month) || {}
      monthData[categoryName] = (monthData[categoryName] || 0) + Math.abs(t.amount)
      monthlyData.set(month, monthData)
    })

  // Convert to array format for chart
  const data = Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6) // Last 6 months
    .map(([month, categories]) => {
      const date = new Date(month + "-01")
      const monthStr = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })

      const result: any = { month: monthStr }
      topCategories.forEach((cat) => {
        result[cat] = parseFloat((categories[cat] || 0).toFixed(2))
      })

      return result
    })

  if (data.length === 0 || topCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Track spending across your top 5 categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Generate colors for categories
  const colors = [
    "#ef4444", // red
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#ec4899", // pink
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Monthly breakdown of your top 5 spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-2">
          <div className={isMobile ? "h-[300px] min-w-[560px]" : "h-[350px] w-full"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                />
                <YAxis
                  width={isMobile ? 48 : 56}
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                  tickFormatter={(value) => {
                    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
                    return `${symbol}${(value / 1000).toFixed(0)}k`
                  }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                {!isMobile && <Legend />}
                {topCategories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={colors[index % colors.length]}
                    radius={index === topCategories.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Legend with Totals */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
          {topCategories.map((category, index) => {
            const total = categoryTotals.get(category)?.total || 0
            return (
              <div key={category} className="text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <p className="text-xs text-muted-foreground truncate">{category}</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(total)}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
