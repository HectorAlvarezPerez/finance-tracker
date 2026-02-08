"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"

interface ExpensesByCategoryChartProps {
  points: Array<Record<string, string | number>>
  categoryOrder: string[]
  categoryColors: Record<string, string>
  periodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function ExpensesByCategoryChart({
  points,
  categoryOrder,
  categoryColors,
  periodLabel,
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
      comparisonLabel={periodLabel}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage="No expense data available for this period"
      onRetry={onRetry}
    >
      <div className="h-[250px] w-full sm:h-[300px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points}>
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

                return (
                  <div className="max-w-[240px] space-y-1 rounded-md border bg-background p-2 shadow">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry) => {
                      const value = Number(entry.value ?? 0)

                      return (
                        <p key={`${entry.name}-${String(entry.dataKey)}`} className="text-xs text-muted-foreground">
                          {entry.name}: {formatCurrency(value)}
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

      <div className="max-h-[180px] space-y-2 overflow-auto border-t pt-3">
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
