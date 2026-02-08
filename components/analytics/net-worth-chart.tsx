"use client"

import { useTranslations } from "next-intl"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"

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
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 24 : 14}
            />
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
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "10px",
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) {
                  return null
                }

                const value = Number(payload[0].value ?? 0)

                return (
                  <div className="max-w-[220px] rounded-md border bg-background p-2 shadow">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="hsl(var(--primary))"
              strokeWidth={isMobile ? 2.3 : 2.2}
              dot={false}
              name={t("netWorthLabel")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
