"use client"

import { useTranslations } from "next-intl"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/lib/hooks/use-currency"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ChartContainer } from "@/components/insights/chart-container"
import { formatCurrencyTick, TooltipCard } from "@/components/analytics/chart-helpers"
import { chartTokens } from "@/lib/theme/chartTokens"

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
  periodLabel: string
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function IncomeVsExpensesChart({
  points,
  totals,
  periodLabel,
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

  const hasData = chartData.length > 0
  const incomeFill = chartTokens.accessibility.usePatternFills
    ? "url(#income-bars-pattern)"
    : chartTokens.semantic.success
  const expensesFill = chartTokens.accessibility.usePatternFills
    ? "url(#expense-bars-pattern)"
    : chartTokens.semantic.danger

  return (
    <ChartContainer
      title={t("incomeVsExpenses")}
      description={t("compareIncome")}
      comparisonLabel={periodLabel}
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
      </div>

      <div className="h-[240px] w-full sm:h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={isMobile ? "20%" : "30%"} barGap={8}>
            <defs>
              <pattern id="income-bars-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="8" height="8" fill={chartTokens.semantic.success} />
                <path d="M0 8L8 0" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              </pattern>
              <pattern id="expense-bars-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="8" height="8" fill={chartTokens.semantic.danger} />
                <path d="M1 0L1 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              </pattern>
            </defs>
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

                const items = payload
                  .map((entry) => ({
                    key: String(entry.dataKey),
                    label: String(entry.name ?? entry.dataKey),
                    value: Number(entry.value ?? 0),
                    color: String(entry.fill ?? entry.color ?? chartTokens.neutrals.axis),
                  }))
                  .sort((a, b) => b.value - a.value)

                return (
                  <TooltipCard
                    title={String(label)}
                    rows={items.map((item) => ({
                      id: item.key,
                      label: item.label,
                      value: formatCurrency(item.value),
                      color: item.color,
                    }))}
                  />
                )
              }}
            />
            <Bar dataKey="income" fill={incomeFill} name={t("income")} radius={[10, 10, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" fill={expensesFill} name={t("expenses")} radius={[10, 10, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{t("totalIncome")}</p>
          <p className="text-xl font-semibold" style={{ color: chartTokens.semantic.success }}>
            {formatCurrency(totals.income)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{t("totalExpenses")}</p>
          <p className="text-xl font-semibold" style={{ color: chartTokens.semantic.danger }}>
            {formatCurrency(totals.expenses)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{t("net")}</p>
          <p
            className="text-xl font-semibold"
            style={{ color: totals.net >= 0 ? chartTokens.semantic.success : chartTokens.semantic.danger }}
          >
            {formatCurrency(totals.net)}
          </p>
        </div>
      </div>
    </ChartContainer>
  )
}
