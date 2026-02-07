"use client"

import { useTranslations } from "next-intl"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
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

interface MonthlyTrendsChartProps {
  points: MonthlyPoint[]
  avgSavingsRate: number
  current: MonthlyPoint
  previous: MonthlyPoint
  periodLabel: string
  previousPeriodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function MonthlyTrendsChart({
  points,
  avgSavingsRate,
  current,
  previous,
  periodLabel,
  previousPeriodLabel,
  loading,
  error,
  onRetry,
}: MonthlyTrendsChartProps) {
  const t = useTranslations("insights")
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  const chartData = points.map((item) => ({ ...item, month: item.monthLabel }))
  const hasData = chartData.length > 0
  const netComparison = compareValues(current.net, previous.net)
  const bestMonth = hasData
    ? chartData.reduce((max, item) => (item.net > max.net ? item : max), chartData[0]).month
    : "—"
  const trendUp = hasData ? chartData[chartData.length - 1].net > chartData[0].net : false

  return (
    <ChartContainer
      title={t("monthlyTrends")}
      description={t("netIncomeRate")}
      comparisonLabel={`${periodLabel} vs ${previousPeriodLabel}`}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage={t("noData")}
      onRetry={onRetry}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          {t("avgSavingsRate")}: <span className={`font-semibold ${avgSavingsRate >= 0 ? "text-emerald-600" : "text-red-600"}`}>{avgSavingsRate.toFixed(1)}%</span>
        </p>
        <p className={`rounded-full px-2 py-1 text-xs font-semibold ${netComparison.delta >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
          Δ {formatCurrency(netComparison.delta)} ({netComparison.deltaPct === null ? "—" : `${netComparison.deltaPct >= 0 ? "+" : ""}${netComparison.deltaPct.toFixed(1)}%`})
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className={isMobile ? "h-[300px] min-w-[560px]" : "h-[350px] w-full"}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: isMobile ? 11 : 12 }} />
              <YAxis
                yAxisId="left"
                width={isMobile ? 48 : 56}
                tick={{ fontSize: isMobile ? 11 : 12 }}
                tickFormatter={(value) => {
                  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency
                  return `${symbol}${(value / 1000).toFixed(0)}k`
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                width={isMobile ? 40 : 52}
                tick={{ fontSize: isMobile ? 11 : 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const rowIndex = chartData.findIndex((item) => item.month === label)
                  const previousRow = rowIndex > 0 ? chartData[rowIndex - 1] : null

                  return (
                    <div className="space-y-1 rounded-md border bg-background p-2 shadow">
                      <p className="text-sm font-medium">{label}</p>
                      {payload.map((entry) => {
                        const seriesName = String(entry.name)
                        const dataKey = String(entry.dataKey)
                        const currentValue = Number(entry.value ?? 0)
                        const previousValue = previousRow ? Number((previousRow as Record<string, unknown>)[dataKey] ?? 0) : 0
                        const comparison = compareValues(currentValue, previousValue)
                        const isPercent = dataKey === "savingsRate"

                        return (
                          <p key={`${seriesName}-${dataKey}`} className="text-xs text-muted-foreground">
                            {seriesName}: {isPercent ? `${currentValue.toFixed(1)}%` : formatCurrency(currentValue)} | Δ {isPercent ? `${comparison.delta.toFixed(1)}%` : formatCurrency(comparison.delta)} ({comparison.deltaPct === null ? "—" : `${comparison.deltaPct >= 0 ? "+" : ""}${comparison.deltaPct.toFixed(1)}%`})
                          </p>
                        )
                      })}
                    </div>
                  )
                }}
              />
              {!isMobile && <Legend wrapperStyle={{ fontSize: 12 }} />}
              <Bar yAxisId="left" dataKey="net" fill="hsl(var(--primary))" name={t("netIncome")} radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="savingsRate" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: isMobile ? 3 : 4 }} name={t("savingsRate")} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("avgNetLabel")}</p>
          <p className="text-base font-semibold">{formatCurrency(chartData.reduce((sum, item) => sum + item.net, 0) / Math.max(chartData.length, 1))}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("bestMonth")}</p>
          <p className="text-base font-semibold text-emerald-600">{bestMonth}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("avgTransactions")}</p>
          <p className="text-base font-semibold">{Math.round(chartData.reduce((sum, item) => sum + item.transactions, 0) / Math.max(chartData.length, 1))}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("trend")}</p>
          <p className={`text-base font-semibold ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
            {trendUp ? `↑ ${t("up")}` : `↓ ${t("down")}`}
          </p>
        </div>
      </div>
    </ChartContainer>
  )
}
