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
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(holding.asset_name)
  const [symbol, setSymbol] = useState(holding.asset_symbol || "")
  const [assetType, setAssetType] = useState<string>(holding.asset_type)
  const [quantity, setQuantity] = useState(holding.quantity.toString())
  const [avgBuyPrice, setAvgBuyPrice] = useState(holding.average_buy_price.toString())
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    setName(holding.asset_name)
    setSymbol(holding.asset_symbol || "")
    setAssetType(holding.asset_type)
    setQuantity(holding.quantity.toString())
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
          average_buy_price: parseFloat(avgBuyPrice),
        })
        .eq("id", holding.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Holding updated successfully",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update holding",
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
            <DialogTitle>Edit Holding</DialogTitle>
            <DialogDescription>
              Update the details of your investment holding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Asset Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., iShares MSCI World ETF"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-symbol">Symbol (Optional)</Label>
              <Input
                id="edit-symbol"
                placeholder="e.g., IWDA, SPY, BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For reference only
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Asset Type</Label>
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
              <Label htmlFor="edit-quantity">Number of Shares</Label>
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
              <Label htmlFor="edit-avgBuyPrice">Average Buy Price (per share)</Label>
              <Input
                id="edit-avgBuyPrice"
                type="number"
                step="0.01"
                placeholder="e.g., 75.50"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Price you paid per share on average
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Holding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

