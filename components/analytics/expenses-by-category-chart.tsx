"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"
import { compareValues } from "@/lib/insights/helpers"

interface ExpensesByCategoryChartProps {
  points: Array<Record<string, string | number>>
  categoryOrder: string[]
  categoryColors: Record<string, string>
  periodLabel: string
  previousPeriodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function ExpensesByCategoryChart({
  points,
  categoryOrder,
  categoryColors,
  periodLabel,
  previousPeriodLabel,
  loading,
  error,
  onRetry,
}: ExpensesByCategoryChartProps) {
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  const hasData = useMemo(
    () =>
      points.some((item) =>
        categoryOrder.some((category) => Number(item[category] ?? 0) > 0)
      ),
    [categoryOrder, points]
  )

  return (
    <ChartContainer
      title="Expenses by Category"
      description="Monthly breakdown of spending categories (TOP 8 + Other)"
      comparisonLabel={`${periodLabel} vs ${previousPeriodLabel}`}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage="No expense data available for this period"
      onRetry={onRetry}
    >
      <div className="w-full overflow-x-auto pb-2">
        <div className={isMobile ? "h-[300px] min-w-[600px]" : "h-[360px] w-full"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: isMobile ? 11 : 12 }} />
              <YAxis
                width={isMobile ? 48 : 56}
                tick={{ fontSize: isMobile ? 11 : 12 }}
                tickFormatter={(value) => {
                  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency
                  return `${symbol}${(value / 1000).toFixed(0)}k`
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const rowIndex = points.findIndex((item) => item.month === label)
                  const previousRow = rowIndex > 0 ? points[rowIndex - 1] : null

                  return (
                    <div className="space-y-1 rounded-md border bg-background p-2 shadow">
                      <p className="text-sm font-medium">{label}</p>
                      {payload.map((entry) => {
                        const dataKey = String(entry.dataKey)
                        const value = Number(entry.value ?? 0)
                        const previousValue = previousRow ? Number(previousRow[dataKey] ?? 0) : 0
                        const comparison = compareValues(value, previousValue)

                        return (
                          <p key={`${dataKey}-${entry.name}`} className="text-xs text-muted-foreground">
                            {entry.name}: {formatCurrency(value)} | Δ {formatCurrency(comparison.delta)} ({comparison.deltaPct === null ? "—" : `${comparison.deltaPct >= 0 ? "+" : ""}${comparison.deltaPct.toFixed(1)}%`})
                          </p>
                        )
                      })}
                    </div>
                  )
                }}
              />
              {!isMobile && <Legend wrapperStyle={{ fontSize: 12 }} />}
              {categoryOrder.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="spend"
                  fill={categoryColors[category] ?? "#64748b"}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="max-h-[160px] space-y-2 overflow-auto border-t pt-3">
        {categoryOrder.map((category) => {
          const total = points.reduce((sum, item) => sum + Number(item[category] ?? 0), 0)
          return (
            <div key={category} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColors[category] ?? "#64748b" }} />
                <span className="truncate">{category}</span>
              </span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
          )
        })}
      </div>
    </ChartContainer>
  )
}
