"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"
import {
  aggregateExpenseCategories,
  applyTopCategoriesWithOther,
  compareValues,
  getMonthDateRange,
  INSIGHTS_DONUT_TOP_CATEGORY_LIMIT,
  getMonthLabel,
  getMonthSequence,
  getPreviousMonth,
  normalizeCategory,
  toIsoDate,
  toMonthKey,
  toMonthKeyFromDate,
  type InsightsTransaction,
} from "@/lib/insights/helpers"
import { getCategoryColor } from "@/lib/utils/colorMap"

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]

type InsightsFilters = {
  year: number
  month: number
}

type MonthlyMetricPoint = {
  monthKey: string
  monthLabel: string
  income: number
  expenses: number
  net: number
  savingsRate: number
  transactions: number
}

type NetWorthPoint = {
  date: string
  netWorth: number
}

type CategoryDistributionPoint = {
  key: string
  name: string
  color: string
  total: number
  percentage: number
  previousTotal: number
  delta: number
  deltaPct: number | null
}

type InsightsPayload = {
  period: {
    year: number
    month: number
    monthKey: string
    label: string
    previousLabel: string
    previousMonthKey: string
  }
  transactions: {
    current: InsightsTransaction[]
    previous: InsightsTransaction[]
    rollingSixMonths: InsightsTransaction[]
    allFetched: InsightsTransaction[]
  }
  netWorth: {
    points: NetWorthPoint[]
    currentValue: number
    previousValue: number
    delta: number
    deltaPct: number | null
  }
  monthlyMetrics: {
    points: MonthlyMetricPoint[]
    current: MonthlyMetricPoint
    previous: MonthlyMetricPoint
    totals: {
      income: number
      expenses: number
      net: number
    }
    avgSavingsRate: number
  }
  categoryMonthly: {
    points: Array<Record<string, number | string>>
    categoryOrder: string[]
    categoryColors: Record<string, string>
  }
  categoryDistribution: {
    items: CategoryDistributionPoint[]
    total: number
    previousTotal: number
    delta: number
    deltaPct: number | null
  }
}

const INSIGHTS_CACHE = new Map<string, InsightsPayload>()

function formatShortMonth(monthKey: string) {
  const [yearPart, monthPart] = monthKey.split("-")
  return new Date(Number(yearPart), Number(monthPart) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

function createEmptyMonthlyMetric(monthKey: string): MonthlyMetricPoint {
  return {
    monthKey,
    monthLabel: formatShortMonth(monthKey),
    income: 0,
    expenses: 0,
    net: 0,
    savingsRate: 0,
    transactions: 0,
  }
}

function toNumber(value: number) {
  return Number(value.toFixed(2))
}

function buildInsightsPayload(
  allTransactions: InsightsTransaction[],
  filters: InsightsFilters
): InsightsPayload {
  const { year, month } = filters
  const monthKey = toMonthKey(year, month)
  const previous = getPreviousMonth(year, month)
  const previousMonthKey = toMonthKey(previous.year, previous.month)
  const periodLabel = getMonthLabel(year, month)
  const previousLabel = getMonthLabel(previous.year, previous.month)

  const sixMonths = getMonthSequence(year, month, 6).map((entry) => entry.key)
  const sixMonthsSet = new Set(sixMonths)
  const categoryMonths = getMonthSequence(year, month, 12).map((entry) => entry.key)
  const categoryMonthsSet = new Set(categoryMonths)

  const currentTransactions = allTransactions.filter((item) => toMonthKeyFromDate(item.date) === monthKey)
  const previousTransactions = allTransactions.filter(
    (item) => toMonthKeyFromDate(item.date) === previousMonthKey
  )
  const rollingTransactions = allTransactions.filter((item) =>
    sixMonthsSet.has(toMonthKeyFromDate(item.date))
  )
  const rollingCategoryTransactions = allTransactions.filter((item) =>
    categoryMonthsSet.has(toMonthKeyFromDate(item.date))
  )

  const monthlyMap = new Map<string, MonthlyMetricPoint>()
  sixMonths.forEach((key) => {
    monthlyMap.set(key, createEmptyMonthlyMetric(key))
  })

  rollingTransactions.forEach((transaction) => {
    if (!transaction.category_id) {
      return
    }

    const monthRef = monthlyMap.get(toMonthKeyFromDate(transaction.date))
    if (!monthRef) {
      return
    }

    if (transaction.amount > 0) {
      monthRef.income += transaction.amount
    } else {
      monthRef.expenses += Math.abs(transaction.amount)
    }

    monthRef.transactions += 1
  })

  const monthlyPoints = sixMonths.map((key) => {
    const item = monthlyMap.get(key) ?? createEmptyMonthlyMetric(key)
    const net = item.income - item.expenses
    const savingsRate = item.income > 0 ? (net / item.income) * 100 : 0

    return {
      ...item,
      income: toNumber(item.income),
      expenses: toNumber(item.expenses),
      net: toNumber(net),
      savingsRate: Number(savingsRate.toFixed(1)),
    }
  })

  const currentMonthly = monthlyPoints[monthlyPoints.length - 1] ?? createEmptyMonthlyMetric(monthKey)
  const previousMonthly =
    monthlyPoints[monthlyPoints.length - 2] ?? createEmptyMonthlyMetric(previousMonthKey)

  const monthlyTotals = monthlyPoints.reduce(
    (acc, point) => {
      acc.income += point.income
      acc.expenses += point.expenses
      acc.net += point.net
      return acc
    },
    { income: 0, expenses: 0, net: 0 }
  )

  const avgSavingsRate =
    monthlyPoints.length > 0
      ? monthlyPoints.reduce((sum, point) => sum + point.savingsRate, 0) / monthlyPoints.length
      : 0

  const selectedRange = getMonthDateRange(year, month)
  const ninetyStart = new Date(selectedRange.end)
  ninetyStart.setDate(ninetyStart.getDate() - 89)
  const ninetyStartIso = toIsoDate(ninetyStart)
  const endIso = selectedRange.endDate

  const dailyChanges = new Map<string, number>()
  allTransactions.forEach((transaction) => {
    if (transaction.date < ninetyStartIso || transaction.date > endIso) {
      return
    }

    const current = dailyChanges.get(transaction.date) ?? 0
    dailyChanges.set(transaction.date, current + transaction.amount)
  })

  let runningBalance = 0
  allTransactions.forEach((transaction) => {
    if (transaction.date < ninetyStartIso) {
      runningBalance += transaction.amount
    }
  })

  const netWorthData: NetWorthPoint[] = []
  const loopDate = new Date(ninetyStart)
  while (loopDate <= selectedRange.end) {
    const dateIso = toIsoDate(loopDate)
    runningBalance += dailyChanges.get(dateIso) ?? 0

    netWorthData.push({
      date: new Date(dateIso).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      netWorth: toNumber(runningBalance),
    })

    loopDate.setDate(loopDate.getDate() + 1)
  }

  const sampledNetWorth = netWorthData.filter(
    (_, index) =>
      index === 0 || index === netWorthData.length - 1 || index % 3 === 0
  )

  const currentNetWorth = sampledNetWorth[sampledNetWorth.length - 1]?.netWorth ?? 0
  const previousNetWorth = sampledNetWorth[0]?.netWorth ?? 0
  const netWorthComparison = compareValues(currentNetWorth, previousNetWorth)

  const expenseMonthlyByCategory = new Map<string, Map<string, { name: string; color: string; total: number }>>()
  categoryMonths.forEach((key) => {
    expenseMonthlyByCategory.set(key, new Map())
  })

  rollingCategoryTransactions.forEach((transaction) => {
    if (transaction.amount >= 0) {
      return
    }

    const monthRef = expenseMonthlyByCategory.get(toMonthKeyFromDate(transaction.date))
    if (!monthRef) {
      return
    }

    const category = normalizeCategory(transaction.categories) as CategoryRow | null
    if (!category) {
      return
    }

    const key = transaction.category_id ?? "uncategorized"
    const current = monthRef.get(key) ?? {
      name: category.name,
      color: getCategoryColor({
        categoryId: key,
        categoryName: category.name,
        fallbackColor: category.color,
      }),
      total: 0,
    }
    current.total += Math.abs(transaction.amount)
    monthRef.set(key, current)
  })

  const windowCategoryTotals = new Map<string, { name: string; color: string; total: number }>()
  expenseMonthlyByCategory.forEach((monthMap) => {
    monthMap.forEach((value, key) => {
      const current = windowCategoryTotals.get(key) ?? { ...value, total: 0 }
      current.total += value.total
      windowCategoryTotals.set(key, current)
    })
  })

  const groupedWindowCategories = applyTopCategoriesWithOther(
    Array.from(windowCategoryTotals.entries()).map(([key, value]) => ({
      key,
      ...value,
    }))
  )

  const visibleCategoryKeys = new Set(
    groupedWindowCategories.filter((item) => item.key !== "other").map((item) => item.key)
  )

  const categoryColors: Record<string, string> = {}
  const categoryOrder = groupedWindowCategories.map((item) => item.name)
  groupedWindowCategories.forEach((item) => {
    categoryColors[item.name] = item.color
  })

  const categoryMonthlyPoints = categoryMonths.map((monthRef) => {
    const monthMap = expenseMonthlyByCategory.get(monthRef) ?? new Map()
    const row: Record<string, number | string> = {
      monthKey: monthRef,
      month: formatShortMonth(monthRef),
    }

    groupedWindowCategories.forEach((categoryItem) => {
      if (categoryItem.key === "other") {
        let otherTotal = 0
        monthMap.forEach((value, key) => {
          if (!visibleCategoryKeys.has(key)) {
            otherTotal += value.total
          }
        })
        row[categoryItem.name] = toNumber(otherTotal)
        return
      }

      row[categoryItem.name] = toNumber(monthMap.get(categoryItem.key)?.total ?? 0)
    })

    return row
  })

  const currentCategoryTotals = aggregateExpenseCategories(currentTransactions)
  const previousCategoryTotals = aggregateExpenseCategories(previousTransactions)
  const groupedCurrentCategories = applyTopCategoriesWithOther(
    currentCategoryTotals,
    INSIGHTS_DONUT_TOP_CATEGORY_LIMIT
  )
  const previousCategoryMap = new Map(previousCategoryTotals.map((item) => [item.key, item.total]))
  const groupedKeys = new Set(groupedCurrentCategories.filter((item) => item.key !== "other").map((item) => item.key))

  const distributionTotal = groupedCurrentCategories.reduce((sum, item) => sum + item.total, 0)
  const previousDistributionTotal = previousCategoryTotals.reduce((sum, item) => sum + item.total, 0)
  const distributionComparison = compareValues(distributionTotal, previousDistributionTotal)

  const distributionItems: CategoryDistributionPoint[] = groupedCurrentCategories.map((item) => {
    let previousTotal = previousCategoryMap.get(item.key) ?? 0

    if (item.key === "other") {
      previousTotal = previousCategoryTotals
        .filter((categoryItem) => !groupedKeys.has(categoryItem.key))
        .reduce((sum, categoryItem) => sum + categoryItem.total, 0)
    }

    const comparison = compareValues(item.total, previousTotal)

    return {
      key: item.key,
      name: item.name,
      color: item.color,
      total: toNumber(item.total),
      previousTotal: toNumber(previousTotal),
      percentage: distributionTotal > 0 ? Number(((item.total / distributionTotal) * 100).toFixed(1)) : 0,
      delta: toNumber(comparison.delta),
      deltaPct: comparison.deltaPct === null ? null : Number(comparison.deltaPct.toFixed(1)),
    }
  })

  return {
    period: {
      year,
      month,
      monthKey,
      label: periodLabel,
      previousLabel,
      previousMonthKey,
    },
    transactions: {
      current: currentTransactions,
      previous: previousTransactions,
      rollingSixMonths: rollingTransactions,
      allFetched: allTransactions,
    },
    netWorth: {
      points: sampledNetWorth,
      currentValue: toNumber(currentNetWorth),
      previousValue: toNumber(previousNetWorth),
      delta: toNumber(netWorthComparison.delta),
      deltaPct: netWorthComparison.deltaPct === null ? null : Number(netWorthComparison.deltaPct.toFixed(1)),
    },
    monthlyMetrics: {
      points: monthlyPoints,
      current: currentMonthly,
      previous: previousMonthly,
      totals: {
        income: toNumber(monthlyTotals.income),
        expenses: toNumber(monthlyTotals.expenses),
        net: toNumber(monthlyTotals.net),
      },
      avgSavingsRate: Number(avgSavingsRate.toFixed(1)),
    },
    categoryMonthly: {
      points: categoryMonthlyPoints,
      categoryOrder,
      categoryColors,
    },
    categoryDistribution: {
      items: distributionItems,
      total: toNumber(distributionTotal),
      previousTotal: toNumber(previousDistributionTotal),
      delta: toNumber(distributionComparison.delta),
      deltaPct: distributionComparison.deltaPct === null ? null : Number(distributionComparison.deltaPct.toFixed(1)),
    },
  }
}

async function fetchInsightsPayload(
  userId: string,
  year: number,
  month: number
): Promise<InsightsPayload> {
  const supabase = createBrowserClient()
  const twelveMonthStart = getMonthSequence(year, month, 12)[0]
  const fetchStartDate = getMonthDateRange(twelveMonthStart.year, twelveMonthStart.month).startDate
  const fetchEndDate = getMonthDateRange(year, month).endDate

  const { data, error } = await supabase
    .from("transactions")
    .select("id,user_id,account_id,date,amount,currency,description,category_id,notes,created_at,updated_at,categories(*)")
    .eq("user_id", userId)
    .gte("date", fetchStartDate)
    .lte("date", fetchEndDate)
    .order("date", { ascending: true })

  if (error) {
    throw error
  }

  return buildInsightsPayload((data ?? []) as InsightsTransaction[], { year, month })
}

export function useInsightsData(userId: string, filters: InsightsFilters) {
  const [data, setData] = useState<InsightsPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const cacheKey = useMemo(
    () => `${userId}:${filters.year}-${String(filters.month).padStart(2, "0")}`,
    [filters.month, filters.year, userId]
  )

  const retry = useCallback(() => {
    setReloadToken((previous) => previous + 1)
  }, [])

  useEffect(() => {
    const cached = INSIGHTS_CACHE.get(cacheKey)
    if (cached) {
      setData(cached)
    }

    let cancelled = false
    const timeout = window.setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const payload = await fetchInsightsPayload(userId, filters.year, filters.month)
        if (cancelled) {
          return
        }
        INSIGHTS_CACHE.set(cacheKey, payload)
        setData(payload)
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError?.message || "Failed to load insights data.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [cacheKey, filters.month, filters.year, reloadToken, userId])

  return {
    data,
    loading,
    error,
    retry,
  }
}
