import type { Database } from "@/types/database"

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"]

export type JoinedCategory = CategoryRow | CategoryRow[] | null

export type InsightsTransaction = TransactionRow & {
  categories: JoinedCategory
}

export type Comparison = {
  delta: number
  deltaPct: number | null
}

export type CategoryAggregate = {
  key: string
  name: string
  color: string
  total: number
}

export const INSIGHTS_TOP_CATEGORY_LIMIT = 8
const OTHER_CATEGORY_COLOR = "#94a3b8"

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`
}

export function fromMonthKey(monthKey: string): { year: number; month: number } {
  const [yearPart, monthPart] = monthKey.split("-")
  return {
    year: Number(yearPart),
    month: Number(monthPart),
  }
}

export function getMonthDateRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)

  return {
    start,
    end,
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  }
}

export function getPreviousMonth(year: number, month: number) {
  if (month === 1) {
    return { year: year - 1, month: 12 }
  }

  return { year, month: month - 1 }
}

export function getMonthLabel(year: number, month: number, locale = "en-US") {
  return new Date(year, month - 1, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  })
}

export function getMonthSequence(
  year: number,
  month: number,
  count: number
): Array<{ year: number; month: number; key: string }> {
  const values: Array<{ year: number; month: number; key: string }> = []
  let currentYear = year
  let currentMonth = month

  for (let index = 0; index < count; index += 1) {
    values.unshift({
      year: currentYear,
      month: currentMonth,
      key: toMonthKey(currentYear, currentMonth),
    })

    const previous = getPreviousMonth(currentYear, currentMonth)
    currentYear = previous.year
    currentMonth = previous.month
  }

  return values
}

export function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0]
}

export function normalizeCategory(category: JoinedCategory): CategoryRow | null {
  if (!category) {
    return null
  }

  return Array.isArray(category) ? category[0] ?? null : category
}

export function toMonthKeyFromDate(dateString: string) {
  return dateString.substring(0, 7)
}

export function compareValues(current: number, previous: number): Comparison {
  const delta = current - previous
  if (previous === 0) {
    return {
      delta,
      deltaPct: null,
    }
  }

  return {
    delta,
    deltaPct: (delta / previous) * 100,
  }
}

export function aggregateExpenseCategories(
  transactions: InsightsTransaction[]
): CategoryAggregate[] {
  const map = new Map<string, CategoryAggregate>()

  transactions.forEach((transaction) => {
    // Keep existing repo behavior: expense insights are based on negative amounts,
    // including transfer categories when they are recorded as negative transactions.
    if (transaction.amount >= 0) {
      return
    }

    const category = normalizeCategory(transaction.categories)
    const key = transaction.category_id ?? "uncategorized"
    const current = map.get(key) ?? {
      key,
      name: category?.name ?? "Uncategorized",
      color: category?.color ?? "#64748b",
      total: 0,
    }

    current.total += Math.abs(transaction.amount)
    map.set(key, current)
  })

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export function applyTopCategoriesWithOther(
  categories: CategoryAggregate[],
  topLimit = INSIGHTS_TOP_CATEGORY_LIMIT
): CategoryAggregate[] {
  if (categories.length <= topLimit + 1) {
    return categories
  }

  const sorted = [...categories].sort((a, b) => b.total - a.total)
  const top = sorted.slice(0, topLimit)
  const other = sorted.slice(topLimit)
  const otherTotal = other.reduce((sum, item) => sum + item.total, 0)

  return [
    ...top,
    {
      key: "other",
      name: "Other",
      color: OTHER_CATEGORY_COLOR,
      total: otherTotal,
    },
  ]
}
