"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useCurrency } from "@/lib/hooks/use-currency"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type Account = Database["public"]["Tables"]["accounts"]["Row"]

interface NetWorthChartProps {
  transactions: Transaction[]
  accounts: Account[]
}

export function NetWorthChart({ transactions, accounts }: NetWorthChartProps) {
  const t = useTranslations('insights')
  const { formatCurrency, currency } = useCurrency()

  // Calculate net worth over time
  const calculateNetWorth = () => {
    // Group all transactions by date
    const dailyChanges = new Map<string, number>()

    transactions
      .filter((t) => true)
      .forEach((t) => {
        const date = t.date
        const current = dailyChanges.get(date) || 0
        dailyChanges.set(date, current + t.amount)
      })

    // Generate array of last 90 days
    const dates: string[] = []
    const today = new Date()

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Calculate cumulative net worth from oldest to newest
    let runningBalance = 0
    const data: { date: string; netWorth: number }[] = []

    // First, add all transactions before our 90-day window
    const startDate = dates[0]
    transactions
      .filter((t) => t.date < startDate)
      .forEach((t) => {
        runningBalance += t.amount
      })

    // Now calculate day by day through the 90-day period
    dates.forEach((date) => {
      const change = dailyChanges.get(date) || 0
      runningBalance += change

      data.push({
        date,
        netWorth: runningBalance,
      })
    })

    // Sample every 3 days for cleaner chart, but keep first and last
    const sampledData = data.filter((_, index) =>
      index === 0 || index === data.length - 1 || index % 3 === 0
    )

    return sampledData.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      netWorth: parseFloat(d.netWorth.toFixed(2)),
    }))
  }

  const data = calculateNetWorth()

  // Calculate trend
  const firstValue = data[0]?.netWorth || 0
  const lastValue = data[data.length - 1]?.netWorth || 0
  const change = lastValue - firstValue
  const percentChange = firstValue !== 0 ? (change / Math.abs(firstValue)) * 100 : 0
  const isPositive = change >= 0

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('netWorth')}</CardTitle>
          <CardDescription>{t('trackWealth')}</CardDescription>
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
        <CardTitle className="flex items-center justify-between">
          <span>{t('netWorth')}</span>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{isPositive ? "+" : ""}{percentChange.toFixed(1)}%</span>
          </div>
        </CardTitle>
        <CardDescription>{t('last90Days')} - {t('current')}: {formatCurrency(lastValue)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
                return `${symbol}${(value / 1000).toFixed(0)}k`
              }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), t('netWorthLabel')]}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name={t('netWorthLabel')}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

