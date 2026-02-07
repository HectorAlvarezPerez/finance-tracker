"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { ChartContainer } from "@/components/insights/chart-container"

interface CategoryDistributionItem {
  key: string
  name: string
  color: string
  total: number
  percentage: number
  previousTotal: number
  delta: number
  deltaPct: number | null
}

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: CategoryDistributionItem }>
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="space-y-1 rounded-md border bg-background p-2 shadow">
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(item.total, "EUR", "es-ES")} ({item.percentage.toFixed(1)}%)
      </p>
      <p className="text-xs text-muted-foreground">
        Δ {formatCurrency(item.delta, "EUR", "es-ES")} ({item.deltaPct === null ? "—" : `${item.deltaPct >= 0 ? "+" : ""}${item.deltaPct.toFixed(1)}%`})
      </p>
    </div>
  )
}

export function ExpensesByCategoryDonut({
  items,
  total,
  periodLabel,
  previousPeriodLabel,
  loading,
  error,
  onRetry,
}: {
  items: CategoryDistributionItem[]
  total: number
  periodLabel: string
  previousPeriodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  const hasData = items.length > 0 && total > 0

  return (
    <ChartContainer
      title="Expenses by Category (Donut)"
      description="Distribution of expenses for the selected period"
      comparisonLabel={`${periodLabel} vs ${previousPeriodLabel}`}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage="No hay gastos en este periodo"
      onRetry={onRetry}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={items} dataKey="total" nameKey="name" innerRadius={70} outerRadius={112} paddingAngle={2}>
                {items.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-md border p-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="truncate text-sm font-medium">{item.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(1)}% | Δ {item.deltaPct === null ? "—" : `${item.deltaPct >= 0 ? "+" : ""}${item.deltaPct.toFixed(1)}%`}
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(item.total, "EUR", "es-ES")}</p>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  )
}
