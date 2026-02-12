"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"

export function AddHoldingDialog({ userId }: { userId: string }) {
  const t = useTranslations('portfolio')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [assetType, setAssetType] = useState<string>("etf")
  const [quantity, setQuantity] = useState("")
  const [weeklyQuantity, setWeeklyQuantity] = useState("0")
  const [monthlyQuantity, setMonthlyQuantity] = useState("0")
  const [avgBuyPrice, setAvgBuyPrice] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const parseRecurringQuantity = (value: string) => {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("holdings").insert({
        user_id: userId,
        asset_name: name,
        asset_symbol: symbol ? symbol.toUpperCase() : null,
        asset_type: assetType,
        quantity: parseFloat(quantity),
        weekly_quantity: parseRecurringQuantity(weeklyQuantity),
        monthly_quantity: parseRecurringQuantity(monthlyQuantity),
        average_buy_price: parseFloat(avgBuyPrice),
        currency: "EUR",
      })

      if (error) throw error

      toast({
        title: t('success'),
        description: t('addHoldingSuccess'),
      })

      setOpen(false)
      setName("")
      setSymbol("")
      setQuantity("")
      setWeeklyQuantity("0")
      setMonthlyQuantity("0")
      setAvgBuyPrice("")
      router.refresh()
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('failedAddHolding'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('addHolding')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('addHoldingTitle')}</DialogTitle>
            <DialogDescription>
              {t('addHoldingDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('assetName')}</Label>
              <Input
                id="name"
                placeholder="e.g., iShares MSCI World ETF"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">{t('symbolOptional')}</Label>
              <Input
                id="symbol"
                placeholder="e.g., IWDA, SPY, BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t('symbolReferenceOnly')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetType">{t('assetType')}</Label>
              <Select value={assetType} onValueChange={setAssetType}>
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
              <Label htmlFor="quantity">{t('numberOfShares')}</Label>
              <Input
                id="quantity"
                type="number"
                step="0.00000001"
                placeholder="e.g., 100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgBuyPrice">{t('avgBuyPricePerShare')}</Label>
              <Input
                id="avgBuyPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 75.50"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('avgBuyPriceHelp')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weeklyQuantity">{t('weeklyQuantity')}</Label>
                <Input
                  id="weeklyQuantity"
                  type="number"
                  min="0"
                  step="0.00000001"
                  placeholder="e.g., 1"
                  value={weeklyQuantity}
                  onChange={(e) => setWeeklyQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyQuantity">{t('monthlyQuantity')}</Label>
                <Input
                  id="monthlyQuantity"
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('adding') : t('addHolding')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
