"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  calculateBudgetProgress,
  formatPeriodLabel,
  getPeriodDateRange,
  normalizeCategoryRelation,
  summarizeProgress,
  type BudgetExpenseTransaction,
  type BudgetFilters,
  type BudgetProgressItem,
  type BudgetWithCategory,
} from "@/lib/budgets/helpers"
import type { Database } from "@/types/database"

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]

type BudgetProgressPayload = {
  categories: CategoryRow[]
  budgets: BudgetWithCategory[]
  expenseTransactions: BudgetExpenseTransaction[]
  progress: BudgetProgressItem[]
  totals: {
    budgeted: number
    spent: number
    remaining: number
  }
  periodLabel: string
}

const BUDGET_PROGRESS_CACHE = new Map<string, BudgetProgressPayload>()

function normalizeBudgetRow(row: any): BudgetWithCategory {
  return {
    ...row,
    amount: Number(row.amount ?? 0),
    month: row.month === null ? null : Number(row.month),
    categories: normalizeCategoryRelation(row.categories),
  } as BudgetWithCategory
}

function normalizeExpenseTransaction(row: any): BudgetExpenseTransaction {
  return {
    id: row.id,
    date: row.date,
    description: row.description,
    amount: Number(row.amount ?? 0),
    currency: row.currency,
    category_id: row.category_id,
    categories: normalizeCategoryRelation(row.categories),
  }
}

async function fetchBudgetProgress(
  userId: string,
  filters: BudgetFilters
): Promise<BudgetProgressPayload> {
  const supabase = createBrowserClient()
  const { startDate, endDate } = getPeriodDateRange(filters)

  const categoriesPromise = supabase
    .from("categories")
    .select("id,user_id,name,type,color,icon,created_at")
    .eq("user_id", userId)
    .eq("type", "expense")
    .order("name")

  let budgetsQuery = supabase
    .from("budgets")
    .select(
      "id,user_id,category_id,period_type,year,month,currency,amount,notes,created_at,updated_at,categories(id,name,color,type)"
    )
    .eq("user_id", userId)
    .eq("period_type", filters.periodType)
    .order("updated_at", { ascending: false })

  const transactionsPromise = supabase
    .from("transactions")
    .select("id,date,amount,currency,description,category_id,categories(id,name,color,type)")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .lt("amount", 0)
    .not("category_id", "is", null)
    .order("date", { ascending: false })

  const [{ data: categories, error: categoriesError }, { data: budgets, error: budgetsError }, { data: transactions, error: transactionsError }] = await Promise.all([
    categoriesPromise,
    budgetsQuery,
    transactionsPromise,
  ])

  if (categoriesError) {
    throw categoriesError
  }

  if (budgetsError) {
    throw budgetsError
  }

  if (transactionsError) {
    throw transactionsError
  }

  const normalizedBudgetsRaw = (budgets ?? []).map(normalizeBudgetRow)
  const normalizedBudgets = Array.from(
    normalizedBudgetsRaw.reduce((map, budget) => {
      if (!map.has(budget.category_id)) {
        map.set(budget.category_id, budget)
      }
      return map
    }, new Map<string, BudgetWithCategory>()).values()
  )
  // Budget spend excludes transfers/investments by only counting expense categories.
  const normalizedTransactions = (transactions ?? [])
    .map(normalizeExpenseTransaction)
    .filter((transaction) => transaction.categories?.type === "expense")

  const progress = calculateBudgetProgress(normalizedBudgets, normalizedTransactions, filters)
  const aggregated = summarizeProgress(progress)

  return {
    categories: categories ?? [],
    budgets: normalizedBudgets,
    expenseTransactions: normalizedTransactions,
    progress,
    totals: {
      budgeted: Number(aggregated.budgeted.toFixed(2)),
      spent: Number(aggregated.spent.toFixed(2)),
      remaining: Number((aggregated.budgeted - aggregated.spent).toFixed(2)),
    },
    periodLabel: formatPeriodLabel(filters),
  }
}

export function useBudgetProgress(userId: string, filters: BudgetFilters) {
  const [data, setData] = useState<BudgetProgressPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const cacheKey = useMemo(
    () => `${userId}:${filters.periodType}:${filters.year}:${filters.month}`,
    [filters.month, filters.periodType, filters.year, userId]
  )

  const retry = useCallback(() => {
    setReloadToken((previous) => previous + 1)
  }, [])

  useEffect(() => {
    const cached = BUDGET_PROGRESS_CACHE.get(cacheKey)
    if (cached) {
      setData(cached)
    }

    let cancelled = false

    const timeout = window.setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const payload = await fetchBudgetProgress(userId, filters)
        if (cancelled) {
          return
        }

        BUDGET_PROGRESS_CACHE.set(cacheKey, payload)
        setData(payload)
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError?.message ?? "No se pudieron cargar los presupuestos.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 200)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [cacheKey, filters, reloadToken, userId])

  return {
    data,
    loading,
    error,
    retry,
  }
}
