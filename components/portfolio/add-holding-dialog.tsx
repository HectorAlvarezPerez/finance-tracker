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

export function AddHoldingDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [assetType, setAssetType] = useState<string>("etf")
  const [quantity, setQuantity] = useState("")
  const [avgBuyPrice, setAvgBuyPrice] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

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
        average_buy_price: parseFloat(avgBuyPrice),
        currency: "EUR",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Holding added successfully",
      })

      setOpen(false)
      setName("")
      setSymbol("")
      setQuantity("")
      setAvgBuyPrice("")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add holding",
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
          Add Holding
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Investment Holding</DialogTitle>
            <DialogDescription>
              Add a new asset to your portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                placeholder="e.g., iShares MSCI World ETF"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol (Optional)</Label>
              <Input
                id="symbol"
                placeholder="e.g., IWDA, SPY, BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For reference only
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
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
              <Label htmlFor="quantity">Number of Shares</Label>
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
              <Label htmlFor="avgBuyPrice">Average Buy Price (per share)</Label>
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
                Price you paid per share on average
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Holding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

