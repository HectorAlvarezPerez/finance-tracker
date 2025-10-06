// Budget Calculator
// Handles budget calculations, tracking, and variance analysis

import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type Budget = Database["public"]["Tables"]["budgets"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export interface BudgetProgress {
  budgetId: string
  categoryId: string | null
  categoryName: string
  budgetAmount: number
  spentAmount: number
  remainingAmount: number
  percentageUsed: number
  status: "under" | "near" | "over"
  month: string
}

export interface BudgetInsight {
  type: "warning" | "info" | "success"
  message: string
  categoryId?: string
  amount?: number
}

export class BudgetCalculator {
  // Calculate budget progress for a specific month
  static calculateProgress(
    budget: Budget,
    transactions: Transaction[],
    category: Category | null
  ): BudgetProgress {
    // Filter transactions for the budget month and category
    const budgetMonth = new Date(budget.month)
    const monthStart = new Date(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1)
    const monthEnd = new Date(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0)

    const relevantTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      const inMonth = transactionDate >= monthStart && transactionDate <= monthEnd
      const matchesCategory = budget.category_id
        ? t.category_id === budget.category_id
        : true
      const isExpense = t.amount < 0 // Expenses are negative
      return inMonth && matchesCategory && isExpense
    })

    // Sum up spending (absolute value since expenses are negative)
    const spentAmount = Math.abs(
      relevantTransactions.reduce((sum, t) => sum + t.amount, 0)
    )

    const remainingAmount = budget.amount_total - spentAmount
    const percentageUsed = (spentAmount / budget.amount_total) * 100

    let status: "under" | "near" | "over"
    if (percentageUsed >= 100) {
      status = "over"
    } else if (percentageUsed >= 80) {
      status = "near"
    } else {
      status = "under"
    }

    return {
      budgetId: budget.id,
      categoryId: budget.category_id,
      categoryName: category?.name || "Overall",
      budgetAmount: budget.amount_total,
      spentAmount,
      remainingAmount,
      percentageUsed,
      status,
      month: budget.month,
    }
  }

  // Generate budget insights
  static generateInsights(
    progresses: BudgetProgress[],
    previousMonthTransactions: Transaction[]
  ): BudgetInsight[] {
    const insights: BudgetInsight[] = []

    // Check for overspending
    const overBudget = progresses.filter((p) => p.status === "over")
    if (overBudget.length > 0) {
      overBudget.forEach((p) => {
        insights.push({
          type: "warning",
          message: `You're over budget on ${p.categoryName} by ${Math.abs(p.remainingAmount).toFixed(2)} ${p.budgetAmount > 0 ? "USD" : ""}`,
          categoryId: p.categoryId || undefined,
          amount: Math.abs(p.remainingAmount),
        })
      })
    }

    // Check for near budget limit
    const nearLimit = progresses.filter((p) => p.status === "near")
    if (nearLimit.length > 0) {
      nearLimit.forEach((p) => {
        insights.push({
          type: "info",
          message: `You've used ${p.percentageUsed.toFixed(0)}% of your ${p.categoryName} budget`,
          categoryId: p.categoryId || undefined,
        })
      })
    }

    // Check for good performance
    const underBudget = progresses.filter((p) => p.status === "under" && p.percentageUsed < 50)
    if (underBudget.length > 0) {
      insights.push({
        type: "success",
        message: `Great job! You're under budget in ${underBudget.length} ${underBudget.length === 1 ? "category" : "categories"}`,
      })
    }

    return insights
  }

  // Compare current month to historical average
  static compareToHistory(
    currentMonthTransactions: Transaction[],
    historicalTransactions: Transaction[],
    categoryId?: string
  ): {
    currentTotal: number
    historicalAverage: number
    percentageDiff: number
    isNormal: boolean
  } {
    // Filter by category if specified
    const filterByCategory = (transactions: Transaction[]) =>
      categoryId ? transactions.filter((t) => t.category_id === categoryId) : transactions

    const current = filterByCategory(currentMonthTransactions)
    const historical = filterByCategory(historicalTransactions)

    const currentTotal = Math.abs(current.reduce((sum, t) => sum + t.amount, 0))

    // Group historical by month
    const monthlyTotals = new Map<string, number>()
    historical.forEach((t) => {
      const month = t.date.substring(0, 7) // YYYY-MM
      const current = monthlyTotals.get(month) || 0
      monthlyTotals.set(month, current + Math.abs(t.amount))
    })

    const historicalAverage =
      monthlyTotals.size > 0
        ? Array.from(monthlyTotals.values()).reduce((sum, val) => sum + val, 0) /
          monthlyTotals.size
        : 0

    const percentageDiff =
      historicalAverage > 0 ? ((currentTotal - historicalAverage) / historicalAverage) * 100 : 0

    // Consider "normal" if within 20% of historical average
    const isNormal = Math.abs(percentageDiff) <= 20

    return {
      currentTotal,
      historicalAverage,
      percentageDiff,
      isNormal,
    }
  }

  // Recommend budget amount based on historical spending
  static recommendBudget(
    historicalTransactions: Transaction[],
    categoryId?: string,
    buffer: number = 1.1 // 10% buffer
  ): number {
    const filtered = categoryId
      ? historicalTransactions.filter((t) => t.category_id === categoryId)
      : historicalTransactions

    // Group by month
    const monthlyTotals = new Map<string, number>()
    filtered.forEach((t) => {
      if (t.amount < 0) {
        // Only expenses
        const month = t.date.substring(0, 7)
        const current = monthlyTotals.get(month) || 0
        monthlyTotals.set(month, current + Math.abs(t.amount))
      }
    })

    if (monthlyTotals.size === 0) return 0

    const average =
      Array.from(monthlyTotals.values()).reduce((sum, val) => sum + val, 0) / monthlyTotals.size

    // Apply buffer for safety
    return Math.ceil(average * buffer)
  }
}

