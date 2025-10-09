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
import { AlertTriangle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function DeleteHoldingDialog({
  holding,
  open,
  onOpenChange,
}: {
  holding: Holding
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from("holdings")
        .delete()
        .eq("id", holding.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Deleted ${holding.asset_symbol} from your portfolio`,
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete holding",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Holding
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{holding.asset_symbol}&quot; from your portfolio?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>{holding.quantity.toFixed(8).replace(/\.?0+$/, '')} units of {holding.asset_symbol}</li>
            <li>All associated price history for this holding</li>
            <li>All associated trades (if any)</li>
          </ul>
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Holding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

