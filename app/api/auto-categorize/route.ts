import { NextResponse } from "next/server"
import {
  buildCategoryIndex,
  categorizeTransaction,
} from "@/lib/services/auto-categorization/autoCategorization"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

interface RequestTransaction {
  description?: string | null
  merchant?: string | null
  amount?: number | string | null
}

export async function POST(request: Request) {
  try {
    const { transactions, userId } = (await request.json()) as {
      transactions?: RequestTransaction[]
      userId?: string
    }

    if (!userId || !transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: existingCategories, error } = await supabase
      .from("categories")
      .select("id, name, type")
      .eq("user_id", userId)
      .order("name")

    if (error) {
      throw new Error(error.message)
    }

    if (!existingCategories || existingCategories.length === 0) {
      return NextResponse.json({
        categorizations: transactions.map((_, index) => ({
          index,
          categoryId: null,
          confidence: "low",
          canonicalKey: null,
        })),
      })
    }

    const categoryIndex = buildCategoryIndex(existingCategories)

    const categorizations = transactions.map((transaction, index) => {
      try {
        const result = categorizeTransaction(categoryIndex, {
          description: transaction.description,
          merchant: transaction.merchant,
          amount: toNumber(transaction.amount),
        })

        return {
          index,
          categoryId: result.categoryId,
          confidence: result.confidence,
          canonicalKey: result.canonicalKey,
        }
      } catch {
        return {
          index,
          categoryId: null,
          confidence: "low",
          canonicalKey: null,
        }
      }
    })

    return NextResponse.json({ categorizations })
  } catch (error: any) {
    console.error("Auto categorization error:", error)
    return NextResponse.json(
      {
        error: error?.message || "Failed to categorize transactions",
      },
      { status: 500 }
    )
  }
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}
