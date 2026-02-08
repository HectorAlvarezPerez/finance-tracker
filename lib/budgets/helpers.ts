import type { Database } from "@/types/database"

export type BudgetPeriodType = "monthly" | "annual"
export type BudgetStatus = "ok" | "warning" | "exceeded"

export type BudgetFilters = {
  periodType: BudgetPeriodType
  year: number
  month: number
}

type BudgetRow = Database["public"]["Tables"]["budgets"]["Row"]
type CategoryRow = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name" | "color" | "type"
>

export type BudgetWithCategory = BudgetRow & {
  categories: CategoryRow | null
}

export type BudgetExpenseTransaction = {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category_id: string | null
  categories: CategoryRow | null
}

export type BudgetBreakdownPoint = {
  label: string
  amount: number
  percentage: number
}

export type BudgetProgressItem = {
  budget: BudgetWithCategory
  spent: number
  remaining: number
  usagePct: number
  status: BudgetStatus
  transactions: BudgetExpenseTransaction[]
  breakdown: BudgetBreakdownPoint[]
}

export const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`
}

export function getPeriodDateRange(filters: BudgetFilters) {
  if (filters.periodType === "annual") {
    return {
      startDate: `${filters.year}-01-01`,
      endDate: `${filters.year}-12-31`,
    }
  }

  const monthStart = new Date(filters.year, filters.month - 1, 1)
  const monthEnd = new Date(filters.year, filters.month, 0)

  return {
    startDate: toIsoDate(monthStart),
    endDate: toIsoDate(monthEnd),
  }
}

export function formatPeriodLabel(filters: BudgetFilters) {
  if (filters.periodType === "annual") {
    return `${filters.year}`
  }

  const monthLabel = MONTH_OPTIONS.find((item) => item.value === filters.month)?.label ?? "Month"
  return `${monthLabel} ${filters.year}`
}

export function getBudgetStatus(usagePct: number): BudgetStatus {
  if (usagePct > 100) {
    return "exceeded"
  }
  if (usagePct >= 80) {
    return "warning"
  }
  return "ok"
}

export function getStatusLabel(status: BudgetStatus) {
  if (status === "exceeded") {
    return "Superado"
  }
  if (status === "warning") {
    return "Cerca del limite"
  }
  return "OK"
}

export function getStatusClassName(status: BudgetStatus) {
  if (status === "exceeded") {
    return "border-red-200 bg-red-50 text-red-700"
  }
  if (status === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700"
}

function toNumber(value: number) {
  return Number(value.toFixed(2))
}

function buildMonthlyBreakdown(
  transactions: BudgetExpenseTransaction[],
  year: number,
  month: number
): BudgetBreakdownPoint[] {
  const weeksInMonth = Math.ceil(new Date(year, month, 0).getDate() / 7)
  const weekTotals = new Array<number>(weeksInMonth).fill(0)

  transactions.forEach((transaction) => {
    const transactionDate = new Date(`${transaction.date}T00:00:00`)
    const transactionYear = transactionDate.getFullYear()
    const transactionMonth = transactionDate.getMonth() + 1

    if (transactionYear !== year || transactionMonth !== month) {
      return
    }

    const weekIndex = Math.min(weeksInMonth - 1, Math.floor((transactionDate.getDate() - 1) / 7))
    weekTotals[weekIndex] += Math.abs(transaction.amount)
  })

  const total = weekTotals.reduce((sum, value) => sum + value, 0)

  return weekTotals.map((amount, index) => ({
    label: `Semana ${index + 1}`,
    amount: toNumber(amount),
    percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
  }))
}

function buildAnnualBreakdown(
  transactions: BudgetExpenseTransaction[],
  year: number
): BudgetBreakdownPoint[] {
  const monthlyTotals = new Array<number>(12).fill(0)

  transactions.forEach((transaction) => {
    const transactionDate = new Date(`${transaction.date}T00:00:00`)
    if (transactionDate.getFullYear() !== year) {
      return
    }

    const monthIndex = transactionDate.getMonth()
    monthlyTotals[monthIndex] += Math.abs(transaction.amount)
  })

  const total = monthlyTotals.reduce((sum, value) => sum + value, 0)

  return monthlyTotals.map((amount, index) => ({
    label: MONTH_OPTIONS[index].label.slice(0, 3),
    amount: toNumber(amount),
    percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
  }))
}

function statusRank(status: BudgetStatus) {
  if (status === "exceeded") {
    return 0
  }
  if (status === "warning") {
    return 1
  }
  return 2
}

export function calculateBudgetProgress(
  budgets: BudgetWithCategory[],
  expenseTransactions: BudgetExpenseTransaction[]
): BudgetProgressItem[] {
  const spentByCategory = new Map<string, number>()

  expenseTransactions.forEach((transaction) => {
    if (!transaction.category_id) {
      return
    }

    const current = spentByCategory.get(transaction.category_id) ?? 0
    spentByCategory.set(transaction.category_id, current + Math.abs(transaction.amount))
  })

  const progress = budgets.map((budget) => {
    const spent = toNumber(spentByCategory.get(budget.category_id) ?? 0)
    const amount = Number(budget.amount)
    const usageRaw = amount > 0 ? (spent / amount) * 100 : 0
    const usagePct = Number(usageRaw.toFixed(1))
    const remaining = toNumber(amount - spent)

    const budgetTransactions = expenseTransactions
      .filter((transaction) => transaction.category_id === budget.category_id)
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    const breakdown =
      budget.period_type === "monthly" && budget.month
        ? buildMonthlyBreakdown(budgetTransactions, budget.year, budget.month)
        : buildAnnualBreakdown(budgetTransactions, budget.year)

    return {
      budget,
      spent,
      remaining,
      usagePct,
      status: getBudgetStatus(usagePct),
      transactions: budgetTransactions,
      breakdown,
    }
  })

  return progress.sort((a, b) => {
    const statusCompare = statusRank(a.status) - statusRank(b.status)
    if (statusCompare !== 0) {
      return statusCompare
    }

    if (b.usagePct !== a.usagePct) {
      return b.usagePct - a.usagePct
    }

    return a.budget.categories?.name.localeCompare(b.budget.categories?.name ?? "") ?? 0
  })
}

export function summarizeProgress(progress: BudgetProgressItem[]) {
  return progress.reduce(
    (acc, item) => {
      acc.budgeted += Number(item.budget.amount)
      acc.spent += item.spent
      return acc
    },
    { budgeted: 0, spent: 0 }
  )
}

export function normalizeCategoryRelation(value: unknown): CategoryRow | null {
  if (Array.isArray(value)) {
    return (value[0] ?? null) as CategoryRow | null
  }
  return (value as CategoryRow | null) ?? null
}

export function getBudgetKey(input: {
  period_type: BudgetPeriodType
  year: number
  month: number | null
  category_id: string
}) {
  const monthPart = input.period_type === "monthly" ? String(input.month ?? 0) : "annual"
  return `${input.period_type}:${input.year}:${monthPart}:${input.category_id}`
}
