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
import { DollarSign } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function ManagePricesDialog({
  userId,
  holdings,
}: {
  userId: string
  holdings: Holding[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prices, setPrices] = useState<Map<string, string>>(new Map())
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handlePriceChange = (symbol: string, value: string) => {
    const newPrices = new Map(prices)
    newPrices.set(symbol, value)
    setPrices(newPrices)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const priceInserts = Array.from(prices.entries())
        .filter(([_, price]) => price && parseFloat(price) > 0)
        .map(([symbol, price]) => ({
          user_id: userId,
          asset_symbol: symbol,
          price: parseFloat(price),
          currency: "USD",
          source: "manual" as const,
          as_of: new Date().toISOString(),
        }))

      if (priceInserts.length === 0) {
        throw new Error("Please enter at least one price")
      }

      const { error } = await supabase.from("prices").insert(priceInserts)

      if (error) throw error

      toast({
        title: "Success",
        description: `Updated prices for ${priceInserts.length} ${priceInserts.length === 1 ? "asset" : "assets"}`,
      })

      setOpen(false)
      setPrices(new Map())
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update prices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DollarSign className="h-4 w-4 mr-2" />
          Update Prices
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Asset Prices</DialogTitle>
            <DialogDescription>
              Manually enter current prices for your holdings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {holdings.map((holding) => (
              <div key={holding.id} className="space-y-2">
                <Label htmlFor={holding.asset_symbol}>
                  {holding.asset_symbol} ({holding.asset_type.replace("_", " ")})
                </Label>
                <Input
                  id={holding.asset_symbol}
                  type="number"
                  step="0.01"
                  placeholder="Current price"
                  value={prices.get(holding.asset_symbol) || ""}
                  onChange={(e) => handlePriceChange(holding.asset_symbol, e.target.value)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Prices"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

