/**
 * Recurring Transaction Processor
 * Handles automatic execution of recurring transactions
 */

import { createServerClient } from "@/lib/supabase/server"

export interface RecurringTransaction {
  id: string
  user_id: string
  account_id: string
  description: string
  amount: number
  category_id: string | null
  currency: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval_value: number
  day_of_month?: number | null
  day_of_week?: number | null
  next_run_at: string
  timezone: string
  enabled: boolean
}

/**
 * Calculate the next run date based on frequency
 */
export function calculateNextRunDate(
  currentDate: Date,
  frequency: RecurringTransaction["frequency"],
  intervalValue: number,
  dayOfMonth?: number | null,
  dayOfWeek?: number | null
): Date {
  const nextDate = new Date(currentDate)

  switch (frequency) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + intervalValue)
      break

    case "weekly":
      nextDate.setDate(nextDate.getDate() + intervalValue * 7)
      if (dayOfWeek !== null && dayOfWeek !== undefined) {
        // Adjust to the correct day of week
        const currentDay = nextDate.getDay()
        const diff = (dayOfWeek - currentDay + 7) % 7
        nextDate.setDate(nextDate.getDate() + diff)
      }
      break

    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + intervalValue)
      if (dayOfMonth !== null && dayOfMonth !== undefined) {
        // Handle months with fewer days (e.g., Feb 30 -> Feb 28)
        const maxDays = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          0
        ).getDate()
        nextDate.setDate(Math.min(dayOfMonth, maxDays))
      }
      break

    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + intervalValue)
      if (dayOfMonth !== null && dayOfMonth !== undefined) {
        nextDate.setDate(dayOfMonth)
      }
      break
  }

  return nextDate
}

/**
 * Process all pending recurring transactions
 * Creates real transactions and updates next_run_at
 */
export async function processRecurringTransactions() {
  const supabase = createServerClient()
  const now = new Date()

  try {
    // Fetch all enabled recurring transactions that are due
    const { data: recurringTransactions, error: fetchError } = await supabase
      .from("recurring_transactions")
      .select("*")
      .eq("enabled", true)
      .lte("next_run_at", now.toISOString())

    if (fetchError) {
      console.error("Error fetching recurring transactions:", fetchError)
      return {
        success: false,
        error: fetchError.message,
        processed: 0,
      }
    }

    if (!recurringTransactions || recurringTransactions.length === 0) {
      return {
        success: true,
        message: "No recurring transactions to process",
        processed: 0,
      }
    }

    console.log(
      `Processing ${recurringTransactions.length} recurring transactions...`
    )

    const results = []

    for (const recurring of recurringTransactions) {
      try {
        // Create the actual transaction
        const { error: insertError } = await supabase.from("transactions").insert({
          user_id: recurring.user_id,
          account_id: recurring.account_id,
          description: recurring.description,
          amount: recurring.amount,
          category_id: recurring.category_id,
          currency: recurring.currency,
          date: new Date().toISOString().split("T")[0], // Today's date
          status: "posted",
          notes: `Auto-generated from recurring transaction`,
        })

        if (insertError) {
          console.error(
            `Error creating transaction for recurring ${recurring.id}:`,
            insertError
          )
          results.push({
            recurring_id: recurring.id,
            success: false,
            error: insertError.message,
          })
          continue
        }

        // Calculate next run date
        const nextRunDate = calculateNextRunDate(
          new Date(recurring.next_run_at),
          recurring.frequency,
          recurring.interval_value,
          recurring.day_of_month,
          recurring.day_of_week
        )

        // Update the recurring transaction with next run date
        const { error: updateError } = await supabase
          .from("recurring_transactions")
          .update({
            next_run_at: nextRunDate.toISOString(),
          })
          .eq("id", recurring.id)

        if (updateError) {
          console.error(
            `Error updating recurring transaction ${recurring.id}:`,
            updateError
          )
          results.push({
            recurring_id: recurring.id,
            success: false,
            error: updateError.message,
          })
          continue
        }

        console.log(
          `✅ Processed recurring transaction ${recurring.id}: Created transaction and updated next run to ${nextRunDate.toISOString()}`
        )

        results.push({
          recurring_id: recurring.id,
          success: true,
          next_run: nextRunDate.toISOString(),
        })
      } catch (error: any) {
        console.error(
          `Unexpected error processing recurring ${recurring.id}:`,
          error
        )
        results.push({
          recurring_id: recurring.id,
          success: false,
          error: error.message,
        })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return {
      success: true,
      message: `Processed ${successCount} of ${recurringTransactions.length} recurring transactions`,
      processed: successCount,
      results,
    }
  } catch (error: any) {
    console.error("Unexpected error in processRecurringTransactions:", error)
    return {
      success: false,
      error: error.message,
      processed: 0,
    }
  }
}

