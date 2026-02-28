// Transaction Rules Engine
// Handles auto-categorization and pattern matching

import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type TransactionRule = Database["public"]["Tables"]["transaction_rules"]["Row"]

export interface RuleMatch {
  ruleId: string
  categoryId: string | null
  accountId: string | null
  action: "categorize" | "rename"
}

export class RulesEngine {
  constructor(private rules: TransactionRule[]) {}

  // Apply rules to a single transaction
  applyRules(transaction: Transaction): RuleMatch | null {
    const enabledRules = this.rules.filter((rule) => rule.enabled)

    for (const rule of enabledRules) {
      if (this.matchesPattern(transaction.description, rule.pattern)) {
        return {
          ruleId: rule.id,
          categoryId: rule.default_category_id,
          accountId: rule.default_account_id,
          action: rule.action,
        }
      }
    }

    return null
  }

  // Apply rules to multiple transactions
  applyRulesToBatch(transactions: Transaction[]): Map<string, RuleMatch> {
    const matches = new Map<string, RuleMatch>()

    for (const transaction of transactions) {
      const match = this.applyRules(transaction)
      if (match) {
        matches.set(transaction.id, match)
      }
    }

    return matches
  }

  // Check if description matches pattern (supports regex and simple text matching)
  private matchesPattern(description: string, pattern: string): boolean {
    const lowerDescription = description.toLowerCase()
    const lowerPattern = pattern.toLowerCase()

    // Try regex first
    try {
      const regex = new RegExp(lowerPattern, "i")
      if (regex.test(description)) {
        return true
      }
    } catch {
      // Not a valid regex, fall back to simple matching
    }

    // Simple substring matching
    return lowerDescription.includes(lowerPattern)
  }

  // Suggest rules based on transaction patterns
  static suggestRules(transactions: Transaction[]): Array<{
    pattern: string
    frequency: number
    categoryId: string | null
  }> {
    const descriptionMap = new Map<
      string,
      { count: number; categoryId: string | null; transactions: Transaction[] }
    >()

    // Group transactions by similar descriptions
    for (const transaction of transactions) {
      const normalizedDesc = this.normalizeDescription(transaction.description)

      if (!descriptionMap.has(normalizedDesc)) {
        descriptionMap.set(normalizedDesc, {
          count: 0,
          categoryId: transaction.category_id,
          transactions: [],
        })
      }

      const entry = descriptionMap.get(normalizedDesc)!
      entry.count++
      entry.transactions.push(transaction)
    }

    // Filter for patterns that appear at least 3 times
    const suggestions = Array.from(descriptionMap.entries())
      .filter(([_, data]) => data.count >= 3)
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.count,
        categoryId: data.categoryId,
      }))
      .sort((a, b) => b.frequency - a.frequency)

    return suggestions
  }

  // Normalize description to extract merchant/payee
  private static normalizeDescription(description: string): string {
    // Remove dates, amounts, and transaction IDs
    let normalized = description
      .replace(/\d{2}\/\d{2}\/\d{4}/g, "") // Remove dates
      .replace(/\$[\d,]+\.?\d*/g, "") // Remove amounts
      .replace(/\#\d+/g, "") // Remove IDs
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .toLowerCase()

    // Extract first few words (usually the merchant name)
    const words = normalized.split(" ")
    return words.slice(0, Math.min(3, words.length)).join(" ")
  }
}

// Helper function to detect duplicate transactions
export function detectDuplicates(
  newTransaction: Partial<Transaction>,
  existingTransactions: Transaction[]
): Transaction[] {
  const duplicates: Transaction[] = []

  for (const existing of existingTransactions) {
    // Check if same amount, date, and similar description
    const sameAmount = Math.abs(existing.amount - (newTransaction.amount || 0)) < 0.01
    const sameDate = existing.date === newTransaction.date
    const similarDescription =
      existing.description.toLowerCase().trim() === newTransaction.description?.toLowerCase().trim()

    if (sameAmount && sameDate && similarDescription) {
      duplicates.push(existing)
    }
  }

  return duplicates
}
