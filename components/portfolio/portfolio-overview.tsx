"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, calculateROI, calculateProfitLoss } from "@/lib/utils"
import { TrendingUp, DollarSign, Target, PieChart } from "lucide-react"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function PortfolioOverview({
  holdings,
  prices,
}: {
  holdings: Holding[]
  prices: Map<string, number>
}) {
  // Calculate total portfolio values
  let totalCostBasis = 0
  let totalCurrentValue = 0

  holdings.forEach((holding) => {
    const costBasis = holding.quantity * holding.average_buy_price
    totalCostBasis += costBasis
    const currentPrice = holding.asset_symbol ? (prices.get(holding.asset_symbol) || 0) : 0
    totalCurrentValue += holding.quantity * currentPrice
  })

  const totalProfitLoss = calculateProfitLoss(totalCurrentValue, totalCostBasis)
  const totalROI = calculateROI(totalCurrentValue, totalCostBasis)

  // Calculate allocation by asset type
  const allocationMap = new Map<string, number>()
  holdings.forEach((holding) => {
    const currentPrice = holding.asset_symbol ? (prices.get(holding.asset_symbol) || 0) : 0
    const value = holding.quantity * currentPrice
    const current = allocationMap.get(holding.asset_type) || 0
    allocationMap.set(holding.asset_type, current + value)
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          <p className="text-xs text-muted-foreground">
            Current market value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Basis</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCostBasis)}</div>
          <p className="text-xs text-muted-foreground">
            Total invested
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          <TrendingUp className={`h-4 w-4 ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalProfitLoss >= 0 ? "+" : ""}{formatCurrency(totalProfitLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            Unrealized gains/losses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROI</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalROI >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalROI >= 0 ? "+" : ""}{totalROI.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Return on investment
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

