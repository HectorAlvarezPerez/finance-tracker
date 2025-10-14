"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, calculateROI, calculateProfitLoss } from "@/lib/utils"
import { TrendingUp, TrendingDown, MoreHorizontal, Edit, Trash2, PenSquare } from "lucide-react"
import type { Database } from "@/types/database"
import { DeleteHoldingDialog } from "./delete-holding-dialog"
import { EditHoldingDialog } from "./edit-holding-dialog"
import { ManualPriceDialog } from "./manual-price-dialog"

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
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [deletingHolding, setDeletingHolding] = useState<Holding | null>(null)
  const [manualPriceHolding, setManualPriceHolding] = useState<Holding | null>(null)
  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('noHoldings')}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {t('addFirstHolding')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {holdings.map((holding) => {
          // Get manual price using holding ID
          const currentPrice = prices.get(`manual_${holding.id}`) || 0
          const currentValue = holding.quantity * currentPrice
          const costBasisTotal = holding.quantity * holding.average_buy_price
          const profitLoss = calculateProfitLoss(currentValue, costBasisTotal)
          const roi = calculateROI(currentValue, costBasisTotal)
          const hasPrice = currentPrice > 0

          return (
            <Card key={holding.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-2xl">{holding.asset_name}</CardTitle>
                      {holding.asset_symbol && (
                        <Badge variant="secondary">{holding.asset_symbol}</Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {holding.asset_type.replace("_", " ")}
                      </Badge>
                    </div>
                    {hasPrice ? (
                      <div className="text-sm text-muted-foreground">
                        Current Price: <span className="font-semibold text-foreground">{formatCurrency(currentPrice)}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-600 dark:text-yellow-500">
                        ⚠️ No price set - click &quot;Set Price&quot;
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
                      {hasPrice && (
                        <div className={`text-sm font-semibold flex items-center gap-1 justify-end ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {profitLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {profitLoss >= 0 ? "+" : ""}{formatCurrency(profitLoss)} ({roi >= 0 ? "+" : ""}{roi.toFixed(2)}%)
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setManualPriceHolding(holding)}
                    >
                      <PenSquare className="h-4 w-4 mr-2" />
                      Set Price
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingHolding(holding)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingHolding(holding)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold">{holding.quantity.toFixed(8).replace(/\.?0+$/, '')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Buy Price</p>
                    <p className="text-lg font-semibold">{formatCurrency(holding.average_buy_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="text-lg font-semibold">{formatCurrency(costBasisTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-lg font-semibold">{formatCurrency(currentValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingHolding && (
        <EditHoldingDialog
          holding={editingHolding}
          open={!!editingHolding}
          onOpenChange={(open) => !open && setEditingHolding(null)}
        />
      )}

      {deletingHolding && (
        <DeleteHoldingDialog
          holding={deletingHolding}
          open={!!deletingHolding}
          onOpenChange={(open) => !open && setDeletingHolding(null)}
        />
      )}

      {manualPriceHolding && (
        <ManualPriceDialog
          holding={manualPriceHolding}
          open={!!manualPriceHolding}
          onOpenChange={(open) => !open && setManualPriceHolding(null)}
        />
      )}
    </>
  )
}

