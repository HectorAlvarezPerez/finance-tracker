"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Edit,
  Trash2,
  PenSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { Database } from "@/types/database"
import { DeleteHoldingDialog } from "./delete-holding-dialog"
import { EditHoldingDialog } from "./edit-holding-dialog"
import { ManualPriceDialog } from "./manual-price-dialog"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function HoldingsList({
  holdings,
  prices,
  userId: _userId,
}: {
  holdings: Holding[]
  prices: Map<string, number>
  userId: string
}) {
  const t = useTranslations("portfolio")
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [deletingHolding, setDeletingHolding] = useState<Holding | null>(null)
  const [manualPriceHolding, setManualPriceHolding] = useState<Holding | null>(null)
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set())

  const toggleHoldingDetails = (holdingId: string) => {
    setExpandedHoldings((prev) => {
      const next = new Set(prev)
      if (next.has(holdingId)) {
        next.delete(holdingId)
      } else {
        next.add(holdingId)
      }
      return next
    })
  }

  const formatQuantity = (value: number) => value.toFixed(8).replace(/\.?0+$/, "")

  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">{t("noHoldings")}</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">{t("addFirstHolding")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {holdings.map((holding) => {
          const currentPrice = prices.get(`manual_${holding.id}`) || 0
          const currentValue = holding.quantity * currentPrice
          const costBasisTotal = holding.quantity * holding.average_buy_price
          const profitLoss = calculateProfitLoss(currentValue, costBasisTotal)
          const roi = calculateROI(currentValue, costBasisTotal)
          const hasPrice = currentPrice > 0
          const isExpanded = expandedHoldings.has(holding.id)

          return (
            <Card key={holding.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg sm:text-xl">{holding.asset_name}</CardTitle>
                      {holding.asset_symbol && (
                        <Badge variant="secondary">{holding.asset_symbol}</Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {holding.asset_type.replace("_", " ")}
                      </Badge>
                    </div>

                    {hasPrice ? (
                      <div className="text-xs text-muted-foreground sm:text-sm">
                        {t("currentPrice")}:{" "}
                        <span className="font-semibold text-foreground">
                          {formatCurrency(currentPrice, holding.currency)}
                        </span>
                        <span className="ml-2">{t("priceStatusSet")}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-700 dark:text-amber-500 sm:text-sm">
                        {t("priceStatusMissing")}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col gap-2 md:items-end">
                    <div className="text-left md:text-right">
                      <div className="text-xl font-bold sm:text-2xl">
                        {formatCurrency(currentValue, holding.currency)}
                      </div>
                      {hasPrice && (
                        <div
                          className={`mt-1 flex items-center gap-1 text-sm font-semibold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {profitLoss >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>
                            {profitLoss >= 0 ? "+" : ""}
                            {formatCurrency(profitLoss, holding.currency)}
                          </span>
                          <span>
                            ({roi >= 0 ? "+" : ""}
                            {roi.toFixed(2)}%)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setManualPriceHolding(holding)}
                      >
                        <PenSquare className="mr-2 h-4 w-4" />
                        {t("setPrice")}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHoldingDetails(holding.id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? t("hideDetails") : t("showDetails")}
                        {isExpanded ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingHolding(holding)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingHolding(holding)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="rounded-md border bg-muted/20 p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">{t("quantity")}</p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatQuantity(holding.quantity)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {t("avgBuyPrice")}
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatCurrency(holding.average_buy_price, holding.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {t("totalInvested")}
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatCurrency(costBasisTotal, holding.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {t("currentValue")}
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatCurrency(currentValue, holding.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">{t("roi")}</p>
                        <p
                          className={`text-sm font-semibold sm:text-base ${hasPrice ? (roi >= 0 ? "text-green-600" : "text-red-600") : "text-muted-foreground"}`}
                        >
                          {hasPrice ? `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%` : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {t("weeklyQuantity")}
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatQuantity(holding.weekly_quantity || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {t("monthlyQuantity")}
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          {formatQuantity(holding.monthly_quantity || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
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
