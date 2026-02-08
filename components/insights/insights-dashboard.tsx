"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GripVertical } from "lucide-react"
import { NetWorthChart } from "@/components/analytics/net-worth-chart"
import { IncomeVsExpensesChart } from "@/components/analytics/income-vs-expenses-chart"
import { MonthlyTrendsChart } from "@/components/analytics/monthly-trends-chart"
import { ExpensesByCategoryChart } from "@/components/analytics/expenses-by-category-chart"
import { ExpensesByCategoryDonut } from "@/components/insights/expenses-by-category-donut"
import { SpendingInsights } from "@/components/insights/spending-insights"
import { TopCategories } from "@/components/insights/top-categories"
import { InsightsFiltersBar } from "@/components/insights/insights-filters-bar"
import { useInsightsData } from "@/lib/hooks/use-insights-data"
import { getMonthLabel, getPreviousMonth } from "@/lib/insights/helpers"

const INSIGHTS_WIDGET_ORDER_KEY = "insights:widget-order:v1"

type WidgetId =
  | "netWorth"
  | "categoryDonut"
  | "categoryBars"
  | "incomeVsExpenses"
  | "monthlyTrends"

const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "netWorth",
  "categoryDonut",
  "categoryBars",
  "incomeVsExpenses",
  "monthlyTrends",
]

const WIDGET_LABELS: Record<WidgetId, string> = {
  netWorth: "Net Worth",
  categoryDonut: "Expenses Donut",
  categoryBars: "Expenses by Category",
  incomeVsExpenses: "Income vs Expenses",
  monthlyTrends: "Monthly Trends",
}

const WIDGET_COL_SPANS: Record<WidgetId, string> = {
  netWorth: "md:col-span-2 xl:col-span-3",
  categoryDonut: "md:col-span-1 xl:col-span-1",
  categoryBars: "md:col-span-1 xl:col-span-2",
  incomeVsExpenses: "md:col-span-1 xl:col-span-1",
  monthlyTrends: "md:col-span-1 xl:col-span-1",
}

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

function normalizeWidgetOrder(value: unknown): WidgetId[] {
  if (!Array.isArray(value)) {
    return DEFAULT_WIDGET_ORDER
  }

  const filtered = value.filter((item): item is WidgetId =>
    DEFAULT_WIDGET_ORDER.includes(item as WidgetId)
  )

  const missing = DEFAULT_WIDGET_ORDER.filter((item) => !filtered.includes(item))
  return [...filtered, ...missing]
}

export function InsightsDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const now = new Date()
  const defaultYear = now.getFullYear()
  const defaultMonth = now.getMonth() + 1
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(DEFAULT_WIDGET_ORDER)
  const [draggingWidgetId, setDraggingWidgetId] = useState<WidgetId | null>(null)
  const [dragOverWidgetId, setDragOverWidgetId] = useState<WidgetId | null>(null)

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

  useEffect(() => {
    const raw = window.localStorage.getItem(INSIGHTS_WIDGET_ORDER_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as unknown
      setWidgetOrder(normalizeWidgetOrder(parsed))
    } catch {
      setWidgetOrder(DEFAULT_WIDGET_ORDER)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      INSIGHTS_WIDGET_ORDER_KEY,
      JSON.stringify(widgetOrder)
    )
  }, [widgetOrder])

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

  const moveWidget = (fromId: WidgetId, toId: WidgetId) => {
    if (fromId === toId) {
      return
    }

    setWidgetOrder((current) => {
      const next = [...current]
      const fromIndex = next.indexOf(fromId)
      const toIndex = next.indexOf(toId)
      if (fromIndex === -1 || toIndex === -1) {
        return current
      }

      next.splice(fromIndex, 1)
      next.splice(toIndex, 0, fromId)
      return next
    })
  }

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

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {widgetOrder.map((widgetId) => (
          <div
            key={widgetId}
            className={`${WIDGET_COL_SPANS[widgetId]} rounded-lg ${
              dragOverWidgetId === widgetId ? "ring-2 ring-primary/40" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOverWidgetId(widgetId)
            }}
            onDrop={(event) => {
              event.preventDefault()
              const droppedId = event.dataTransfer.getData("text/plain") as WidgetId
              moveWidget(droppedId, widgetId)
              setDragOverWidgetId(null)
              setDraggingWidgetId(null)
            }}
            onDragLeave={() => setDragOverWidgetId((current) => (current === widgetId ? null : current))}
          >
            <div className="mb-2 flex items-center justify-end">
              <button
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", widgetId)
                  event.dataTransfer.effectAllowed = "move"
                  setDraggingWidgetId(widgetId)
                }}
                onDragEnd={() => {
                  setDraggingWidgetId(null)
                  setDragOverWidgetId(null)
                }}
                aria-label={`Arrastrar gráfico ${WIDGET_LABELS[widgetId]}`}
                className={`inline-flex h-8 items-center gap-1 rounded-md border px-2 text-xs text-muted-foreground ${
                  draggingWidgetId === widgetId ? "cursor-grabbing bg-muted" : "cursor-grab"
                }`}
              >
                <GripVertical className="h-3.5 w-3.5" />
                Mover
              </button>
            </div>

            {widgetId === "netWorth" && (
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
            )}

            {widgetId === "categoryDonut" && (
              <ExpensesByCategoryDonut
                items={data?.categoryDistribution.items ?? []}
                total={data?.categoryDistribution.total ?? 0}
                periodLabel={periodLabel}
                previousPeriodLabel={previousPeriodLabel}
                loading={loading}
                error={error}
                onRetry={retry}
              />
            )}

            {widgetId === "categoryBars" && (
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
            )}

            {widgetId === "incomeVsExpenses" && (
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
            )}

            {widgetId === "monthlyTrends" && (
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
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-5 sm:pt-6">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Period Insights</h2>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <SpendingInsights
            currentSpending={data?.categoryDistribution.total ?? 0}
            previousSpending={data?.categoryDistribution.previousTotal ?? 0}
            topCategory={topCategory ? { name: topCategory.name, total: topCategory.total } : null}
            periodLabel={periodLabel}
            previousPeriodLabel={previousPeriodLabel}
          />
          <TopCategories items={data?.categoryDistribution.items ?? []} />
        </div>
      </div>
    </div>
  )
}
