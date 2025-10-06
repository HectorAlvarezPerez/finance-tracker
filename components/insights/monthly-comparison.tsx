"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: { name: string; color: string } | null
}

export function MonthlyComparison({
  currentTransactions,
  historicalTransactions,
}: {
  currentTransactions: Transaction[]
  historicalTransactions: Transaction[]
}) {
  // Group by month
  const monthlyData = new Map<string, { income: number; expenses: number }>()

  // Process historical transactions
  historicalTransactions.forEach((t) => {
    const month = t.date.substring(0, 7)
    const current = monthlyData.get(month) || { income: 0, expenses: 0 }
    
    if (t.amount > 0) {
      current.income += t.amount
    } else {
      current.expenses += Math.abs(t.amount)
    }
    
    monthlyData.set(month, current)
  })

  // Process current month
  const currentMonth = new Date().toISOString().substring(0, 7)
  const currentData = { income: 0, expenses: 0 }
  
  currentTransactions.forEach((t) => {
    if (t.amount > 0) {
      currentData.income += t.amount
    } else {
      currentData.expenses += Math.abs(t.amount)
    }
  })
  
  monthlyData.set(currentMonth, currentData)

  // Convert to array and sort
  const data = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      income: data.income,
      expenses: data.expenses,
    }))
    .slice(-6) // Last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Bar dataKey="income" fill="#22c55e" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

