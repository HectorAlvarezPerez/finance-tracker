"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, calculateROI, calculateProfitLoss } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function HoldingsList({
  holdings,
  prices,
  userId,
}: {
  holdings: Holding[]
  prices: Map<string, number>
  userId: string
}) {
  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No holdings yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Add your first investment to start tracking your portfolio
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {holdings.map((holding) => {
        const currentPrice = prices.get(holding.asset_symbol) || 0
        const currentValue = holding.quantity * currentPrice
        const profitLoss = calculateProfitLoss(currentValue, holding.cost_basis_total)
        const roi = calculateROI(currentValue, holding.cost_basis_total)
        const avgCost = holding.cost_basis_total / holding.quantity

        return (
          <Card key={holding.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{holding.asset_symbol}</CardTitle>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {holding.asset_type.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
                  <div className={`text-sm font-semibold flex items-center gap-1 justify-end ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {profitLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {profitLoss >= 0 ? "+" : ""}{formatCurrency(profitLoss)} ({roi >= 0 ? "+" : ""}{roi.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold">{holding.quantity.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Cost</p>
                  <p className="text-lg font-semibold">{formatCurrency(avgCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold">{formatCurrency(currentPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost Basis</p>
                  <p className="text-lg font-semibold">{formatCurrency(holding.cost_basis_total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

