"use client"

import { useTranslations } from "next-intl"
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"
import { formatCurrencyTick, TooltipCard } from "@/components/analytics/chart-helpers"
import { chartTokens } from "@/lib/theme/chartTokens"

interface NetWorthPoint {
  date: string
  netWorth: number
}

interface NetWorthChartProps {
  points: NetWorthPoint[]
  currentValue: number
  periodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function NetWorthChart({
  points,
  currentValue,
  periodLabel,
  loading,
  error,
  onRetry,
}: NetWorthChartProps) {
  const t = useTranslations("insights")
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  const hasData = points.length > 0

  return (
    <ChartContainer
      title={t("netWorth")}
      description={`${t("trackWealth")}`}
      comparisonLabel={periodLabel}
      loading={loading}
      error={error}
      isEmpty={!hasData}
      emptyMessage={t("noData")}
      onRetry={onRetry}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {t("current")}: <span className="font-semibold text-foreground">{formatCurrency(currentValue)}</span>
        </p>
      </div>

      <div className="h-[240px] w-full sm:h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id="net-worth-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartTokens.lines.netWorth}
                  stopOpacity={chartTokens.lines.netWorthAreaOpacity}
                />
                <stop offset="100%" stopColor={chartTokens.lines.netWorth} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTokens.neutrals.grid} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12, fill: chartTokens.neutrals.axis }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 24 : 14}
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

                const value = Number(payload[0].value ?? 0)

                return (
                  <TooltipCard
                    title={String(label)}
                    rows={[{ id: "net-worth", label: t("netWorthLabel"), value: formatCurrency(value) }]}
                  />
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="none"
              fill="url(#net-worth-area-gradient)"
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke={chartTokens.lines.netWorth}
              strokeWidth={isMobile ? 2.8 : 3}
              dot={false}
              activeDot={{
                r: isMobile ? 4 : 5,
                fill: chartTokens.lines.netWorth,
                stroke: chartTokens.neutrals.surface,
                strokeWidth: 1.5,
              }}
              name={t("netWorthLabel")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
