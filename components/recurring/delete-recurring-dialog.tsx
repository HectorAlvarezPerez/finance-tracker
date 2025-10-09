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
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type RecurringTransaction = Database["public"]["Tables"]["recurring_transactions"]["Row"]

export function DeleteRecurringDialog({
  recurring,
  open,
  onOpenChange,
}: {
  recurring: RecurringTransaction
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
        .from("recurring_transactions")
        .delete()
        .eq("id", recurring.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Recurring transaction deleted successfully",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete recurring transaction",
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
            Delete Recurring Transaction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this recurring transaction?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description:</span>
              <span className="text-sm font-medium">{recurring.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className={`text-sm font-semibold ${recurring.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(recurring.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Frequency:</span>
              <span className="text-sm capitalize">{recurring.frequency}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This action cannot be undone. No future transactions will be created from this recurring transaction.
          </p>
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
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

