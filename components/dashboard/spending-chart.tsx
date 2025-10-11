"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
}

export function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  // Group by category and calculate net amount (income - expenses)
  const categoryMap = new Map<string, { name: string; value: number; color: string }>()

  transactions
    .filter((t) => t.categories !== null) // All transactions with categories
    .forEach((t) => {
      const categoryName = t.categories!.name
      const categoryColor = t.categories!.color
      const current = categoryMap.get(categoryName) || { name: categoryName, value: 0, color: categoryColor }
      // Add income as positive, expenses as positive (for net calculation)
      current.value += t.amount // This will be negative for expenses, positive for income
      categoryMap.set(categoryName, current)
    })

  // Filter to only show categories with net spending (negative net = spending)
  // and take absolute value for display
  const data = Array.from(categoryMap.values())
    .filter((c) => c.value < 0) // Only categories with net spending
    .map((c) => ({ ...c, value: Math.abs(c.value) })) // Convert to positive for display
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Top 6 categories

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No net spending data for this month
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

