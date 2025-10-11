import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { holdingId, symbol } = await req.json()

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required for automatic price updates" },
        { status: 400 }
      )
    }

    // Get authentication
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch price from Yahoo Finance API (free, no API key required)
    // Using the v8 finance API endpoint
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
    
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch price from Yahoo Finance" },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Extract the current price
    const quote = data?.chart?.result?.[0]?.meta?.regularMarketPrice
    
    if (!quote || typeof quote !== "number") {
      return NextResponse.json(
        { error: `Could not find price for symbol: ${symbol}` },
        { status: 404 }
      )
    }

    // Store the price in the prices table
    const { error: priceError } = await supabase.from("prices").insert({
      user_id: user.id,
      asset_symbol: symbol.toUpperCase(),
      source: "api",
      price: quote,
      currency: "EUR", // Assuming EUR, adjust if needed
      as_of: new Date().toISOString(),
    })

    if (priceError) {
      console.error("Error saving price:", priceError)
      return NextResponse.json(
        { error: "Failed to save price" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      symbol,
      price: quote,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error updating price:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

