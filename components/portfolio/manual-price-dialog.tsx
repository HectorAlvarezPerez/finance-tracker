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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function ManualPriceDialog({
  holding,
  open,
  onOpenChange,
}: {
  holding: Holding
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('portfolio')
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error(t('notAuthenticated'))
      }

      // Use holding ID as a unique identifier for manual prices
      const uniqueSymbol = `manual_${holding.id}`

      const { error } = await supabase.from("prices").insert({
        user_id: user.id,
        asset_symbol: uniqueSymbol,
        source: "manual",
        price: parseFloat(price),
        currency: holding.currency,
        as_of: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: t('priceUpdated'),
        description: t('manualPriceSetTo', { price: formatCurrency(parseFloat(price), holding.currency) }),
      })

      setPrice("")
      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('failedSetPrice'),
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
            <DialogTitle>{t('setCurrentPriceTitle')}</DialogTitle>
            <DialogDescription>
              {t('setCurrentPriceDescription', { name: holding.asset_name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('currentPricePerShare')}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="e.g., 285.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {t('currentPriceHelp')}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm">
                <span className="font-semibold">{t('shares')}:</span> {holding.quantity.toFixed(8).replace(/\.?0+$/, '')}
              </p>
              {price && (
                <p className="text-sm mt-1">
                  <span className="font-semibold">{t('totalValue')}:</span> {formatCurrency(holding.quantity * parseFloat(price), holding.currency)}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('setting') : t('setPrice')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
