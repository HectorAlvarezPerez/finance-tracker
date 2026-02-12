"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/insights/chart-container"
import { useCurrency } from "@/lib/hooks/use-currency"
import { TooltipCard } from "@/components/analytics/chart-helpers"
import { chartTokens } from "@/lib/theme/chartTokens"
import { useIsMobile } from "@/lib/hooks/use-mobile"

interface CategoryDistributionItem {
  key: string
  name: string
  color: string
  total: number
  percentage: number
}

export function ExpensesByCategoryDonut({
  items,
  total,
  periodLabel,
  loading,
  error,
  onRetry,
}: {
  items: CategoryDistributionItem[]
  total: number
  periodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  const { formatCurrency } = useCurrency()
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.total - a.total),
    [items]
  )

  const hasData = sortedItems.length > 0 && total > 0

  return (
    <ChartContainer
      title="Expenses by Category"
      description="Distribution of expenses for the selected period"
      comparisonLabel={periodLabel}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage="No hay gastos en este periodo"
      onRetry={onRetry}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative h-[240px] sm:h-[280px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedItems}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="82%"
                paddingAngle={2}
                activeIndex={activeIndex}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {sortedItems.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={entry.color}
                    stroke={chartTokens.neutrals.surface}
                    strokeWidth={1.5}
                    fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.35}
                  />
                ))}
              </Pie>
              <Tooltip
                trigger={isMobile ? "click" : "hover"}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const item = payload[0].payload as CategoryDistributionItem
                  return (
                    <TooltipCard
                      title={item.name}
                      rows={[
                        {
                          id: item.key,
                          label: "Share",
                          value: `${item.percentage.toFixed(1)}%`,
                          color: item.color,
                        },
                      ]}
                      footer={{ label: "Amount", value: formatCurrency(item.total) }}
                    />
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Total spent</span>
            <span className="text-lg font-semibold sm:text-xl">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="max-h-[260px] space-y-2 overflow-auto pr-1 sm:max-h-[320px]">
          {sortedItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-md border p-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="truncate text-sm font-medium">{item.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(item.total)}</p>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  )
}
