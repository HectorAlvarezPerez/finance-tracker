"use client"

import { useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NetWorthChart } from "@/components/analytics/net-worth-chart"
import { IncomeVsExpensesChart } from "@/components/analytics/income-vs-expenses-chart"
import { MonthlyTrendsChart } from "@/components/analytics/monthly-trends-chart"
import { ExpensesByCategoryChart } from "@/components/analytics/expenses-by-category-chart"
import { ExpensesByCategoryDonut } from "@/components/insights/expenses-by-category-donut"
import { SpendingInsights } from "@/components/insights/spending-insights"
import { InsightsFiltersBar } from "@/components/insights/insights-filters-bar"
import { useInsightsData } from "@/lib/hooks/use-insights-data"
import { getMonthLabel, getPreviousMonth } from "@/lib/insights/helpers"

function clampMonth(value: number) {
  if (Number.isNaN(value)) {
    return null
  }
  return Math.min(12, Math.max(1, value))
}

function parseNumberParam(value: string | null) {
  if (!value) {
    return NaN
  }
  return Number(value)
}

export function InsightsDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const now = new Date()
  const defaultYear = now.getFullYear()
  const defaultMonth = now.getMonth() + 1

  const selectedYear = useMemo(() => {
    const parsed = parseNumberParam(searchParams.get("year"))
    return Number.isNaN(parsed) ? defaultYear : parsed
  }, [defaultYear, searchParams])

  const selectedMonth = useMemo(() => {
    const parsed = clampMonth(parseNumberParam(searchParams.get("month")))
    return parsed ?? defaultMonth
  }, [defaultMonth, searchParams])

  useEffect(() => {
    const yearParam = parseNumberParam(searchParams.get("year"))
    const monthParam = clampMonth(parseNumberParam(searchParams.get("month")))
    const hasValidYear = !Number.isNaN(yearParam)
    const hasValidMonth = monthParam !== null

    if (hasValidYear && hasValidMonth) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("year", String(defaultYear))
    params.set("month", String(defaultMonth))
    router.replace(`/insights?${params.toString()}`)
  }, [defaultMonth, defaultYear, router, searchParams])

  const setFiltersInUrl = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("year", String(year))
    params.set("month", String(month))
    router.replace(`/insights?${params.toString()}`)
  }

  const handleReset = () => {
    setFiltersInUrl(defaultYear, defaultMonth)
  }

  const { data, loading, error, retry } = useInsightsData(userId, {
    year: selectedYear,
    month: selectedMonth,
  })

  const previousFilterMonth = getPreviousMonth(selectedYear, selectedMonth)
  const periodLabel = data?.period.label ?? getMonthLabel(selectedYear, selectedMonth)
  const previousPeriodLabel =
    data?.period.previousLabel ?? getMonthLabel(previousFilterMonth.year, previousFilterMonth.month)

  const topCategory =
    data?.categoryDistribution.items.find((item) => item.name !== "Other") ?? null

  return (
    <div className="container mx-auto space-y-5 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-4 md:px-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive analysis of your financial health and spending patterns</p>
      </div>

      <InsightsFiltersBar
        year={selectedYear}
        month={selectedMonth}
        onYearChange={(year) => setFiltersInUrl(year, selectedMonth)}
        onMonthChange={(month) => setFiltersInUrl(selectedYear, month)}
        onReset={handleReset}
        periodLabel={periodLabel}
        previousPeriodLabel={previousPeriodLabel}
      />

      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-1 xl:col-span-1">
            <ExpensesByCategoryDonut
              items={data?.categoryDistribution.items ?? []}
              total={data?.categoryDistribution.total ?? 0}
              periodLabel={periodLabel}
              previousPeriodLabel={previousPeriodLabel}
              loading={loading}
              error={error}
              onRetry={retry}
            />
          </div>

          <div className="md:col-span-1 xl:col-span-2">
            <ExpensesByCategoryChart
              points={data?.categoryMonthly.points ?? []}
              categoryOrder={data?.categoryMonthly.categoryOrder ?? []}
              categoryColors={data?.categoryMonthly.categoryColors ?? {}}
              periodLabel={periodLabel}
              previousPeriodLabel={previousPeriodLabel}
              loading={loading}
              error={error}
              onRetry={retry}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <IncomeVsExpensesChart
            points={data?.monthlyMetrics.points ?? []}
            totals={data?.monthlyMetrics.totals ?? { income: 0, expenses: 0, net: 0 }}
            current={data?.monthlyMetrics.current ?? { monthKey: "", monthLabel: "", income: 0, expenses: 0, net: 0, savingsRate: 0, transactions: 0 }}
            previous={data?.monthlyMetrics.previous ?? { monthKey: "", monthLabel: "", income: 0, expenses: 0, net: 0, savingsRate: 0, transactions: 0 }}
            periodLabel={periodLabel}
            previousPeriodLabel={previousPeriodLabel}
            loading={loading}
            error={error}
            onRetry={retry}
          />

          <MonthlyTrendsChart
            points={data?.monthlyMetrics.points ?? []}
            avgSavingsRate={data?.monthlyMetrics.avgSavingsRate ?? 0}
            current={data?.monthlyMetrics.current ?? { monthKey: "", monthLabel: "", income: 0, expenses: 0, net: 0, savingsRate: 0, transactions: 0 }}
            previous={data?.monthlyMetrics.previous ?? { monthKey: "", monthLabel: "", income: 0, expenses: 0, net: 0, savingsRate: 0, transactions: 0 }}
            periodLabel={periodLabel}
            previousPeriodLabel={previousPeriodLabel}
            loading={loading}
            error={error}
            onRetry={retry}
          />
        </div>

        <div className="border-t pt-5 sm:pt-6">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">Period Insights</h2>

          <SpendingInsights
            currentSpending={data?.categoryDistribution.total ?? 0}
            previousSpending={data?.categoryDistribution.previousTotal ?? 0}
            topCategory={topCategory ? { name: topCategory.name, total: topCategory.total } : null}
            periodLabel={periodLabel}
            previousPeriodLabel={previousPeriodLabel}
          />
        </div>

        <div className="border-t pt-5 sm:pt-6">
          <NetWorthChart
            points={data?.netWorth.points ?? []}
            currentValue={data?.netWorth.currentValue ?? 0}
            previousValue={data?.netWorth.previousValue ?? 0}
            delta={data?.netWorth.delta ?? 0}
            deltaPct={data?.netWorth.deltaPct ?? null}
            periodLabel={periodLabel}
            previousPeriodLabel={previousPeriodLabel}
            loading={loading}
            error={error}
            onRetry={retry}
          />
        </div>
      </div>
    </div>
  )
}
