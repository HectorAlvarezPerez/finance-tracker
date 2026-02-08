"use client"

import { useTranslations } from "next-intl"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"
import { compareValues } from "@/lib/insights/helpers"

interface MonthlyPoint {
  monthKey: string
  monthLabel: string
  income: number
  expenses: number
  net: number
  savingsRate: number
  transactions: number
}

interface IncomeVsExpensesChartProps {
  points: MonthlyPoint[]
  totals: {
    income: number
    expenses: number
    net: number
  }
  current: MonthlyPoint
  previous: MonthlyPoint
  periodLabel: string
  previousPeriodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function IncomeVsExpensesChart({
  points,
  totals,
  current,
  previous,
  periodLabel,
  previousPeriodLabel,
  loading,
  error,
  onRetry,
}: IncomeVsExpensesChartProps) {
  const t = useTranslations("insights")
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  const chartData = points.map((item) => ({
    ...item,
    month: item.monthLabel,
  }))

  const netComparison = compareValues(current.net, previous.net)
  const hasData = chartData.length > 0

  return (
    <ChartContainer
      title={t("incomeVsExpenses")}
      description={t("compareIncome")}
      comparisonLabel={`${periodLabel} vs ${previousPeriodLabel}`}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage={t("noTransactions")}
      onRetry={onRetry}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          {t("avgNet")}: <span className="font-semibold text-foreground">{formatCurrency(totals.net / Math.max(chartData.length, 1))}</span>
        </p>
        <p className={`rounded-full px-2 py-1 text-xs font-semibold ${netComparison.delta >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
          Δ {formatCurrency(netComparison.delta)} ({netComparison.deltaPct === null ? "—" : `${netComparison.deltaPct >= 0 ? "+" : ""}${netComparison.deltaPct.toFixed(1)}%`})
        </p>
      </div>

      <div className="h-[240px] w-full sm:h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} minTickGap={isMobile ? 24 : 12} />
            <YAxis
              width={isMobile ? 40 : 56}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => {
                const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency
                return `${symbol}${(value / 1000).toFixed(0)}k`
              }}
            />
            <Tooltip
              trigger={isMobile ? "click" : "hover"}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) {
                  return null
                }

                const rowIndex = chartData.findIndex((item) => item.month === label)
                const previousRow = rowIndex > 0 ? chartData[rowIndex - 1] : null

                return (
                  <div className="max-w-[240px] space-y-1 rounded-md border bg-background p-2 shadow">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry) => {
                      const seriesName = String(entry.name)
                      const dataKey = String(entry.dataKey)
                      const currentValue = Number(entry.value ?? 0)
                      const previousValue = previousRow ? Number((previousRow as Record<string, unknown>)[dataKey] ?? 0) : 0
                      const comparison = compareValues(currentValue, previousValue)

                      return (
                        <p key={`${seriesName}-${dataKey}`} className="text-xs text-muted-foreground">
                          {seriesName}: {formatCurrency(currentValue)} | Δ {formatCurrency(comparison.delta)} ({comparison.deltaPct === null ? "—" : `${comparison.deltaPct >= 0 ? "+" : ""}${comparison.deltaPct.toFixed(1)}%`})
                        </p>
                      )
                    })}
                  </div>
                )
              }}
            />
            {!isMobile && <Legend wrapperStyle={{ fontSize: 12 }} />}
            <Bar dataKey="income" fill="hsl(142 71% 45%)" name={t("income")} radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(0 84% 60%)" name={t("expenses")} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("totalIncome")}</p>
          <p className="text-lg font-semibold text-emerald-600">{formatCurrency(totals.income)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("totalExpenses")}</p>
          <p className="text-lg font-semibold text-red-600">{formatCurrency(totals.expenses)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("net")}</p>
          <p className={`text-lg font-semibold ${totals.net >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatCurrency(totals.net)}</p>
        </div>
      </div>
    </ChartContainer>
  )
}
