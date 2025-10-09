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
  const [symbol, setSymbol] = useState(holding.asset_symbol)
  const [assetType, setAssetType] = useState<string>(holding.asset_type)
  const [quantity, setQuantity] = useState(holding.quantity.toString())
  const [costBasis, setCostBasis] = useState(holding.cost_basis_total.toString())
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    setSymbol(holding.asset_symbol)
    setAssetType(holding.asset_type)
    setQuantity(holding.quantity.toString())
    setCostBasis(holding.cost_basis_total.toString())
  }, [holding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("holdings")
        .update({
          asset_symbol: symbol.toUpperCase(),
          asset_type: assetType as Holding["asset_type"],
          quantity: parseFloat(quantity),
          cost_basis_total: parseFloat(costBasis),
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
              <Label htmlFor="edit-symbol">Symbol/Ticker</Label>
              <Input
                id="edit-symbol"
                placeholder="e.g., BTC, SPY, AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Asset Type</Label>
              <Select value={assetType} onValueChange={(value) => setAssetType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="index_fund">Index Fund</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="precious_metal">Precious Metal (Gold, Silver)</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.00000001"
                placeholder="e.g., 10.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-costBasis">Total Cost Basis</Label>
              <Input
                id="edit-costBasis"
                type="number"
                step="0.01"
                placeholder="e.g., 5000.00"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Total amount invested (including fees)
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

