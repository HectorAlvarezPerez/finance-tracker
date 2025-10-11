"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
}

export function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  // Group by category and calculate total expenses only
  const categoryMap = new Map<string, { name: string; value: number; color: string }>()

  transactions
    .filter((t) => t.categories !== null) // All transactions with categories
    .filter((t) => t.amount < 0) // Only expenses (negative amounts)
    .filter((t) => t.categories!.type === 'expense') // Only expense categories (exclude income like salary)
    .forEach((t) => {
      const categoryName = t.categories!.name
      const categoryColor = t.categories!.color
      const current = categoryMap.get(categoryName) || { name: categoryName, value: 0, color: categoryColor }
      current.value += Math.abs(t.amount) // Add as positive for display
      categoryMap.set(categoryName, current)
    })

  // Sort by value and take top 6
  const data = Array.from(categoryMap.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Top 6 categories

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expense data for this month
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

