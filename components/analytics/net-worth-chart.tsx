"use client"

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
  const { formatCurrency, currency } = useCurrency()
  
  // Calculate net worth over time
  const calculateNetWorth = () => {
    // Calculate current balance from all transactions
    const currentBalances = transactions
      .filter((t) => t.status === "posted")
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Group transactions by date (daily)
    const dailyChanges = new Map<string, number>()
    
    transactions
      .filter((t) => t.status === "posted")
      .forEach((t) => {
        const date = t.date
        const current = dailyChanges.get(date) || 0
        dailyChanges.set(date, current + t.amount)
      })
    
    // Sort dates
    const sortedDates = Array.from(dailyChanges.keys()).sort()
    
    // Calculate running net worth (working backwards from current)
    let runningBalance = currentBalances
    const data: { date: string; netWorth: number; change: number }[] = []
    
    // Add current date
    const today = new Date().toISOString().split("T")[0]
    data.push({
      date: today,
      netWorth: runningBalance,
      change: 0,
    })
    
    // Work backwards through last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const dates: string[] = []
    for (let i = 0; i < 90; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }
    
    dates.reverse().forEach((date) => {
      const change = dailyChanges.get(date) || 0
      runningBalance -= change
      
      data.unshift({
        date,
        netWorth: runningBalance,
        change,
      })
    })
    
    // Sample every 3 days for cleaner chart
    return data.filter((_, index) => index % 3 === 0).map((d) => ({
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
          <CardTitle>Net Worth Over Time</CardTitle>
          <CardDescription>Track your total wealth across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Net Worth Over Time</span>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{isPositive ? "+" : ""}{percentChange.toFixed(1)}%</span>
          </div>
        </CardTitle>
        <CardDescription>Last 90 days - Current: {formatCurrency(lastValue)}</CardDescription>
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
              formatter={(value: number) => [formatCurrency(value), "Net Worth"]}
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
              name="Net Worth"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

