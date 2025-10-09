/**
 * Cron Job API Route for Processing Recurring Transactions
 * This endpoint is called by Vercel Cron Jobs to automatically
 * create transactions from recurring transaction templates
 */

import { NextRequest, NextResponse } from "next/server"
import { processRecurringTransactions } from "@/lib/services/recurring-processor"

export const runtime = "edge"
export const dynamic = "force-dynamic"

/**
 * POST /api/cron/process-recurring
 * Processes all pending recurring transactions
 * 
 * Security: Protected by CRON_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (or authorized source)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error("CRON_SECRET not configured")
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized cron request")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("🚀 Starting recurring transactions processing...")

    // Process all pending recurring transactions
    const result = await processRecurringTransactions()

    if (!result.success) {
      console.error("❌ Error processing recurring transactions:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    console.log("✅ Recurring transactions processing complete:", result)

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        processed: result.processed,
        results: result.results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Unexpected error in cron job:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/process-recurring
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: "ok",
      endpoint: "process-recurring",
      message: "Use POST with Bearer token to execute",
    },
    { status: 200 }
  )
}

