"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

interface IncomeVsExpensesChartProps {
  transactions: Transaction[]
}

export function IncomeVsExpensesChart({ transactions }: IncomeVsExpensesChartProps) {
  const t = useTranslations('insights')
  const { formatCurrency, currency } = useCurrency()

  // Group by month
  const monthlyData = new Map<string, { income: number; expenses: number }>()

  transactions
    .filter((t) => t.category_id !== null)
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
          <CardTitle>{t('incomeVsExpenses')}</CardTitle>
          <CardDescription>{t('compareIncome')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t('noTransactions')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('incomeVsExpenses')}</CardTitle>
        <CardDescription>
          {t('last6Months')} - {t('avgNet')}:
          <span className={avgNet >= 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
            {formatCurrency(avgNet)}
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
              tickFormatter={(value) => {
                const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
                return `${symbol}${(value / 1000).toFixed(0)}k`
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
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
              name={t('income')}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              name={t('expenses')}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('totalIncome')}</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totals.income)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('totalExpenses')}</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(totals.expenses)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('net')}</p>
            <p className={`text-lg font-bold ${totals.net >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totals.net)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

