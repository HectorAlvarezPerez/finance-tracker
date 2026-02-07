"use client"

import { useEffect, useMemo, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

const MAX_VISIBLE_CATEGORIES = 8
const MIN_PERCENTAGE = 3

type CategoryJoin =
  | {
      name: string
      color: string
      type: string
    }
  | {
      name: string
      color: string
      type: string
    }[]
  | null

type ExpenseRow = {
  amount: number
  category_id: string | null
  categories: CategoryJoin
}

export type CategoryExpenseDatum = {
  key: string
  name: string
  total: number
  percentage: number
  color: string
}

function normalizeCategory(category: CategoryJoin) {
  if (!category) {
    return null
  }
  return Array.isArray(category) ? category[0] : category
}

function getDateRange(year: number, month: number | null) {
  if (month) {
    const start = `${year}-${String(month).padStart(2, "0")}-01`
    const end = `${year}-${String(month).padStart(2, "0")}-${String(
      new Date(year, month, 0).getDate()
    ).padStart(2, "0")}`
    return { start, end }
  }

  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  }
}

function groupWithOther(items: CategoryExpenseDatum[], total: number): CategoryExpenseDatum[] {
  const sorted = [...items].sort((a, b) => b.total - a.total)
  let otherTotal = 0
  const visible: CategoryExpenseDatum[] = []

  sorted.forEach((item, index) => {
    const percentage = total > 0 ? (item.total / total) * 100 : 0
    const shouldGroup = index >= MAX_VISIBLE_CATEGORIES || percentage < MIN_PERCENTAGE

    if (shouldGroup) {
      otherTotal += item.total
      return
    }

    visible.push({
      ...item,
      percentage,
    })
  })

  if (otherTotal > 0) {
    visible.push({
      key: "other",
      name: "Other",
      total: otherTotal,
      percentage: total > 0 ? (otherTotal / total) * 100 : 0,
      color: "#94a3b8",
    })
  }

  return visible.sort((a, b) => b.total - a.total)
}

export function useExpensesByCategory({
  userId,
  year,
  month,
}: {
  userId: string
  year: number
  month: number | null
}) {
  const [data, setData] = useState<CategoryExpenseDatum[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const periodKey = useMemo(() => `${year}-${month ?? "all"}`, [month, year])

  useEffect(() => {
    let cancelled = false
    const supabase = createBrowserClient()

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const { start, end } = getDateRange(year, month)
        const { data: rows, error: queryError } = await supabase
          .from("transactions")
          .select("amount, category_id, categories(name, color, type)")
          .eq("user_id", userId)
          .lt("amount", 0)
          .gte("date", start)
          .lte("date", end)

        if (queryError) {
          throw queryError
        }

        const categoryTotals = new Map<string, { name: string; total: number; color: string }>()
        ;((rows ?? []) as ExpenseRow[]).forEach((row) => {
          const category = normalizeCategory(row.categories)
          if (category?.type === "income") {
            return
          }

          const key = row.category_id ?? "uncategorized"
          const current = categoryTotals.get(key) || {
            name: category?.name ?? "Uncategorized",
            total: 0,
            color: category?.color ?? "#64748b",
          }

          current.total += Math.abs(row.amount)
          categoryTotals.set(key, current)
        })

        const raw = Array.from(categoryTotals.entries()).map(([key, value]) => ({
          key,
          name: value.name,
          total: value.total,
          percentage: 0,
          color: value.color,
        }))
        const nextTotal = raw.reduce((acc, current) => acc + current.total, 0)
        const grouped = groupWithOther(raw, nextTotal)

        if (!cancelled) {
          setData(grouped)
          setTotal(nextTotal)
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError?.message || "No se pudieron cargar los gastos por categoría.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [month, periodKey, userId, year])

  return {
    data,
    total,
    loading,
    error,
    periodKey,
  }
}
