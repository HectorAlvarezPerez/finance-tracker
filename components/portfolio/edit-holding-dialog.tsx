"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function EditHoldingDialog({
  holding,
  open,
  onOpenChange,
}: {
  holding: Holding
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("portfolio")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(holding.asset_name)
  const [symbol, setSymbol] = useState(holding.asset_symbol || "")
  const [assetType, setAssetType] = useState<string>(holding.asset_type)
  const [quantity, setQuantity] = useState(holding.quantity.toString())
  const [weeklyQuantity, setWeeklyQuantity] = useState(holding.weekly_quantity.toString())
  const [monthlyQuantity, setMonthlyQuantity] = useState(holding.monthly_quantity.toString())
  const [avgBuyPrice, setAvgBuyPrice] = useState(holding.average_buy_price.toString())
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const parseRecurringQuantity = (value: string) => {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  }

  useEffect(() => {
    setName(holding.asset_name)
    setSymbol(holding.asset_symbol || "")
    setAssetType(holding.asset_type)
    setQuantity(holding.quantity.toString())
    setWeeklyQuantity(holding.weekly_quantity.toString())
    setMonthlyQuantity(holding.monthly_quantity.toString())
    setAvgBuyPrice(holding.average_buy_price.toString())
  }, [holding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("holdings")
        .update({
          asset_name: name,
          asset_symbol: symbol ? symbol.toUpperCase() : null,
          asset_type: assetType as Holding["asset_type"],
          quantity: parseFloat(quantity),
          weekly_quantity: parseRecurringQuantity(weeklyQuantity),
          monthly_quantity: parseRecurringQuantity(monthlyQuantity),
          average_buy_price: parseFloat(avgBuyPrice),
        })
        .eq("id", holding.id)

      if (error) throw error

      toast({
        title: t("success"),
        description: t("updateHoldingSuccess"),
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedUpdateHolding"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("updateHoldingTitle")}</DialogTitle>
            <DialogDescription>{t("updateHoldingDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t("assetName")}</Label>
              <Input
                id="edit-name"
                placeholder="e.g., iShares MSCI World ETF"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-symbol">{t("symbolOptional")}</Label>
              <Input
                id="edit-symbol"
                placeholder="e.g., IWDA, SPY, BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("symbolReferenceOnly")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">{t("assetType")}</Label>
              <Select value={assetType} onValueChange={(value) => setAssetType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="index_fund">Index Fund</SelectItem>
                  <SelectItem value="bond_fund">Bond Fund</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="gold">Gold/Precious Metals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">{t("numberOfShares")}</Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.00000001"
                placeholder="e.g., 100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-avgBuyPrice">{t("avgBuyPricePerShare")}</Label>
              <Input
                id="edit-avgBuyPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 75.50"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">{t("avgBuyPriceHelp")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-weeklyQuantity">{t("weeklyQuantity")}</Label>
                <Input
                  id="edit-weeklyQuantity"
                  type="number"
                  min="0"
                  step="0.00000001"
                  placeholder="e.g., 1"
                  value={weeklyQuantity}
                  onChange={(e) => setWeeklyQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-monthlyQuantity">{t("monthlyQuantity")}</Label>
                <Input
                  id="edit-monthlyQuantity"
                  type="number"
                  min="0"
                  step="0.00000001"
                  placeholder="e.g., 4"
                  value={monthlyQuantity}
                  onChange={(e) => setMonthlyQuantity(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("updating") : t("updateHolding")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
