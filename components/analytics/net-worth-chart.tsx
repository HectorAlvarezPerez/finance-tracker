"use client"

import { useTranslations } from "next-intl"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
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
  previousValue: number
  delta: number
  deltaPct: number | null
  periodLabel: string
  previousPeriodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function NetWorthChart({
  points,
  currentValue,
  previousValue,
  delta,
  deltaPct,
  periodLabel,
  previousPeriodLabel,
  loading,
  error,
  onRetry,
}: NetWorthChartProps) {
  const t = useTranslations("insights")
  const { formatCurrency, currency } = useCurrency()
  const isMobile = useIsMobile()

  const hasData = points.length > 0
  const isPositive = delta >= 0

  return (
    <ChartContainer
      title={t("netWorth")}
      description={`${t("trackWealth")}`}
      comparisonLabel={`${periodLabel} vs ${previousPeriodLabel}`}
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
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
          isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
        }`}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>
            Δ {formatCurrency(delta)} ({deltaPct === null ? "—" : `${isPositive ? "+" : ""}${deltaPct.toFixed(1)}%`})
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className={isMobile ? "h-[280px] min-w-[520px]" : "h-[320px] w-full"}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: isMobile ? 11 : 12 }} interval="preserveStartEnd" />
              <YAxis
                width={isMobile ? 48 : 56}
                tick={{ fontSize: isMobile ? 11 : 12 }}
                tickFormatter={(value) => {
                  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency
                  return `${symbol}${(value / 1000).toFixed(0)}k`
                }}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t("netWorthLabel")]}
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
                    <div className="rounded-md border bg-background p-2 shadow">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                      <p className="text-xs text-muted-foreground">
                        vs {previousPeriodLabel}: {formatCurrency(previousValue)}
                      </p>
                    </div>
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="hsl(var(--primary))"
                strokeWidth={isMobile ? 2.5 : 2.2}
                dot={false}
                name={t("netWorthLabel")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartContainer>
  )
}
