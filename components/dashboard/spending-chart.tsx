"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
}

export function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  const { formatCurrency } = useCurrency()
  const isMobile = useIsMobile()
  
  // Group by category and calculate net amount (expenses - income)
  const categoryMap = new Map<string, { name: string; value: number; color: string }>()

  transactions
    .filter((t) => t.categories !== null) // All transactions with categories
    .filter((t) => t.categories!.type !== 'income') // Exclude income categories (like salary)
    .forEach((t) => {
      const categoryName = t.categories!.name
      const categoryColor = t.categories!.color
      const current = categoryMap.get(categoryName) || { name: categoryName, value: 0, color: categoryColor }
      // Add amount directly: negative for expenses, positive for income
      // Net = expenses - income (both represented by their actual amounts)
      current.value += t.amount
      categoryMap.set(categoryName, current)
    })

  // Filter to show only categories with net spending (negative = more expenses than income)
  // Then convert to positive for display
  const data = Array.from(categoryMap.values())
    .filter((c) => c.value < 0) // Only categories with net spending
    .map((c) => ({ ...c, value: Math.abs(c.value) })) // Convert to positive for display
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Top 6 categories

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No net spending data for this period
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={isMobile ? 240 : 300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={!isMobile}
            label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={isMobile ? 72 : 84}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          {!isMobile && <Legend />}
        </PieChart>
      </ResponsiveContainer>

      {isMobile && (
        <div className="grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
