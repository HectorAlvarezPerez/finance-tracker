"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CompactLegend,
  formatCurrencyTick,
  TooltipCard,
} from "@/components/analytics/chart-helpers"
import { chartTokens, type ChartVariant } from "@/lib/theme/chartTokens"

interface ExpensesByCategoryChartProps {
  points: Array<Record<string, string | number>>
  categoryOrder: string[]
  categoryColors: Record<string, string>
  chartVariant?: ChartVariant
  periodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function ExpensesByCategoryChart({
  points,
  categoryOrder,
  categoryColors,
  chartVariant = "stacked",
  periodLabel,
  loading,
  error,
  onRetry,
}: ExpensesByCategoryChartProps) {
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()
  const [monthsBack, setMonthsBack] = useState(4)

  const monthWindowOptions = useMemo(() => {
    const baseOptions = [3, 4, 6, 9, 12]
    const filtered = baseOptions.filter((value) => value <= points.length)
    if (filtered.length > 0) {
      return filtered
    }
    return points.length > 0 ? [points.length] : [1]
  }, [points.length])

  useEffect(() => {
    if (monthsBack > points.length && points.length > 0) {
      setMonthsBack(points.length)
      return
    }

    if (!monthWindowOptions.includes(monthsBack)) {
      setMonthsBack(monthWindowOptions[0])
    }
  }, [monthWindowOptions, monthsBack, points.length])

  const visiblePoints = useMemo(() => {
    if (points.length === 0) {
      return []
    }
    return points.slice(-monthsBack)
  }, [monthsBack, points])

  const hasData = useMemo(
    () =>
      visiblePoints.some((item) =>
        categoryOrder.some((category) => Number(item[category] ?? 0) > 0)
      ),
    [categoryOrder, visiblePoints]
  )

  const lineVariantCategories = useMemo(() => {
    const withoutOther = categoryOrder.filter((category) => category !== "Other")
    const topForLines = withoutOther.slice(0, 5)
    if (categoryOrder.includes("Other")) {
      topForLines.push("Other")
    }
    return topForLines
  }, [categoryOrder])

  const legendItems = useMemo(
    () =>
      categoryOrder.map((category) => {
        const total = visiblePoints.reduce((sum, item) => sum + Number(item[category] ?? 0), 0)
        return {
          key: category,
          label: category,
          color: categoryColors[category] ?? chartTokens.categorical.other,
          value: formatCurrency(total),
        }
      }),
    [categoryColors, categoryOrder, formatCurrency, visiblePoints]
  )

  return (
    <ChartContainer
      title="Expenses by Category"
      description={
        chartVariant === "lines"
          ? "Monthly trend of top expense categories (feature flag: chartVariant=lines)"
          : "Monthly breakdown of spending categories (Top 8 + Other)"
      }
      comparisonLabel={periodLabel}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage="No expense data available for this period"
      onRetry={onRetry}
    >
      <div className="mb-3 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Months back</span>
          <Select
            value={String(monthsBack)}
            onValueChange={(value) => setMonthsBack(Number(value))}
          >
            <SelectTrigger className="h-9 w-[110px]">
              <SelectValue placeholder="Months" />
            </SelectTrigger>
            <SelectContent>
              {monthWindowOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  Last {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[250px] w-full sm:h-[300px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartVariant === "lines" ? (
            <LineChart data={visiblePoints}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTokens.neutrals.grid} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 12, fill: chartTokens.neutrals.axis }}
                minTickGap={isMobile ? 24 : 12}
                axisLine={{ stroke: chartTokens.neutrals.border }}
                tickLine={{ stroke: chartTokens.neutrals.border }}
              />
              <YAxis
                width={isMobile ? 40 : 56}
                tick={{ fontSize: isMobile ? 10 : 12, fill: chartTokens.neutrals.axis }}
                axisLine={{ stroke: chartTokens.neutrals.border }}
                tickLine={{ stroke: chartTokens.neutrals.border }}
                tickFormatter={(value: number) => formatCurrencyTick(Number(value), currency)}
              />
              <Tooltip
                trigger={isMobile ? "click" : "hover"}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const entries = payload
                    .map((entry) => ({
                      key: String(entry.dataKey),
                      label: String(entry.name ?? entry.dataKey),
                      value: Number(entry.value ?? 0),
                      color:
                        typeof entry.color === "string"
                          ? entry.color
                          : chartTokens.categorical.other,
                    }))
                    .filter((entry) => entry.value > 0)
                    .sort((a, b) => b.value - a.value)

                  const monthTotal = entries.reduce((sum, item) => sum + item.value, 0)

                  return (
                    <TooltipCard
                      title={String(label)}
                      rows={entries.map((entry) => ({
                        id: entry.key,
                        label: entry.label,
                        value: formatCurrency(entry.value),
                        color: entry.color,
                      }))}
                      footer={{ label: "Total", value: formatCurrency(monthTotal) }}
                    />
                  )
                }}
              />
              {lineVariantCategories.map((category) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  name={category}
                  stroke={categoryColors[category] ?? chartTokens.categorical.other}
                  strokeDasharray={category === "Other" ? "4 3" : undefined}
                  strokeWidth={category === "Other" ? 2 : 2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={visiblePoints}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTokens.neutrals.grid} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 12, fill: chartTokens.neutrals.axis }}
                minTickGap={isMobile ? 24 : 12}
                axisLine={{ stroke: chartTokens.neutrals.border }}
                tickLine={{ stroke: chartTokens.neutrals.border }}
              />
              <YAxis
                width={isMobile ? 40 : 56}
                tick={{ fontSize: isMobile ? 10 : 12, fill: chartTokens.neutrals.axis }}
                axisLine={{ stroke: chartTokens.neutrals.border }}
                tickLine={{ stroke: chartTokens.neutrals.border }}
                tickFormatter={(value: number) => formatCurrencyTick(Number(value), currency)}
              />
              <Tooltip
                trigger={isMobile ? "click" : "hover"}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const sorted = payload
                    .map((entry) => ({
                      key: String(entry.dataKey),
                      label: String(entry.name ?? entry.dataKey),
                      value: Number(entry.value ?? 0),
                      color:
                        typeof entry.fill === "string"
                          ? entry.fill
                          : typeof entry.color === "string"
                            ? entry.color
                            : chartTokens.categorical.other,
                    }))
                    .filter((entry) => entry.value > 0)
                    .sort((a, b) => b.value - a.value)

                  const monthTotal = sorted.reduce((sum, item) => sum + item.value, 0)
                  const visibleRows = sorted.slice(0, 6)
                  const hiddenCount = sorted.length - visibleRows.length

                  return (
                    <TooltipCard
                      title={String(label)}
                      rows={visibleRows.map((entry) => ({
                        id: entry.key,
                        label: entry.label,
                        value: formatCurrency(entry.value),
                        color: entry.color,
                      }))}
                      moreLabel={hiddenCount > 0 ? `+${hiddenCount} more categories` : undefined}
                      footer={{ label: "Month total", value: formatCurrency(monthTotal) }}
                    />
                  )
                }}
              />
              {categoryOrder.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  name={category}
                  stackId="spend"
                  fill={categoryColors[category] ?? chartTokens.categorical.other}
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="border-t pt-3">
        <CompactLegend items={legendItems} maxVisible={6} />
      </div>
    </ChartContainer>
  )
}
