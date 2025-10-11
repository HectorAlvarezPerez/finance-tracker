"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

interface IncomeVsExpensesChartProps {
  transactions: Transaction[]
}

export function IncomeVsExpensesChart({ transactions }: IncomeVsExpensesChartProps) {
  // Group by month
  const monthlyData = new Map<string, { income: number; expenses: number }>()
  
  transactions
    .filter((t) => t.status === "posted" && t.category_id !== null)
    .forEach((t) => {
      const month = t.date.substring(0, 7) // YYYY-MM
      const current = monthlyData.get(month) || { income: 0, expenses: 0 }
      
      if (t.amount > 0) {
        current.income += t.amount
      } else {
        current.expenses += Math.abs(t.amount)
      }
      
      monthlyData.set(month, current)
    })
  
  // Convert to array, sort, and get last 6 months
  const data = Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, data]) => {
      const date = new Date(month + "-01")
      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: parseFloat(data.income.toFixed(2)),
        expenses: parseFloat(data.expenses.toFixed(2)),
        net: parseFloat((data.income - data.expenses).toFixed(2)),
      }
    })
  
  // Calculate totals
  const totals = data.reduce(
    (acc, curr) => ({
      income: acc.income + curr.income,
      expenses: acc.expenses + curr.expenses,
      net: acc.net + curr.net,
    }),
    { income: 0, expenses: 0, net: 0 }
  )
  
  const avgNet = data.length > 0 ? totals.net / data.length : 0
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Compare your income and spending by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          Last 6 months - Avg Net: 
          <span className={avgNet >= 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
            ${avgNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar 
              dataKey="income" 
              fill="#22c55e" 
              name="Income"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="#ef4444" 
              name="Expenses"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-600">
              ${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-600">
              ${totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Net</p>
            <p className={`text-lg font-bold ${totals.net >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totals.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

