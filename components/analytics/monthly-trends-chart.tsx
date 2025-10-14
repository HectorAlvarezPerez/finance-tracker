"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

interface MonthlyTrendsChartProps {
  transactions: Transaction[]
}

export function MonthlyTrendsChart({ transactions }: MonthlyTrendsChartProps) {
  const t = useTranslations('insights')
  const { formatCurrency, currency } = useCurrency()
  
  // Group by month and calculate metrics
  const monthlyData = new Map<string, { 
    income: number
    expenses: number
    transactions: number 
  }>()
  
  transactions
    .filter((t) => t.status === "posted" && t.category_id !== null)
    .forEach((t) => {
      const month = t.date.substring(0, 7)
      const current = monthlyData.get(month) || { 
        income: 0, 
        expenses: 0, 
        transactions: 0 
      }
      
      if (t.amount > 0) {
        current.income += t.amount
      } else {
        current.expenses += Math.abs(t.amount)
      }
      current.transactions += 1
      
      monthlyData.set(month, current)
    })
  
  // Convert to array and calculate derived metrics
  const data = Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6) // Last 6 months
    .map(([month, metrics]) => {
      const date = new Date(month + "-01")
      const net = metrics.income - metrics.expenses
      const savingsRate = metrics.income > 0 ? (net / metrics.income) * 100 : 0
      
      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        net: parseFloat(net.toFixed(2)),
        savingsRate: parseFloat(savingsRate.toFixed(1)),
        transactions: metrics.transactions,
        income: parseFloat(metrics.income.toFixed(2)),
        expenses: parseFloat(metrics.expenses.toFixed(2)),
      }
    })
  
  // Calculate average savings rate
  const avgSavingsRate = data.length > 0 
    ? data.reduce((sum, d) => sum + d.savingsRate, 0) / data.length 
    : 0
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('monthlyTrends')}</CardTitle>
          <CardDescription>{t('netIncomeRate')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t('noData')}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('monthlyTrends')}</CardTitle>
        <CardDescription>
          {t('netIncomeRate')} - {t('avgSavingsRate')}: 
          <span className={avgSavingsRate >= 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
            {avgSavingsRate.toFixed(1)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
                return `${symbol}${(value / 1000).toFixed(0)}k`
              }}
              label={{ value: t('netIncome'), angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              label={{ value: t('savingsRate'), angle: 90, position: "insideRight", style: { fontSize: 12 } }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === t('savingsRate')) {
                  return [`${value}%`, name]
                }
                return [formatCurrency(value), name]
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="net" 
              fill="#3b82f6" 
              name={t('netIncome')}
              radius={[8, 8, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="savingsRate" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name={t('savingsRate')}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('avgNetLabel')}</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.reduce((sum, d) => sum + d.net, 0) / data.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('bestMonth')}</p>
            <p className="text-lg font-bold text-green-600">
              {data.reduce((max, d) => d.net > max.net ? d : max, data[0]).month}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('avgTransactions')}</p>
            <p className="text-lg font-bold">
              {Math.round(data.reduce((sum, d) => sum + d.transactions, 0) / data.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('trend')}</p>
            <p className={`text-lg font-bold ${
              data[data.length - 1].net > data[0].net ? "text-green-600" : "text-red-600"
            }`}>
              {data[data.length - 1].net > data[0].net ? `↑ ${t('up')}` : `↓ ${t('down')}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

