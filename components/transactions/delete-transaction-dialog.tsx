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
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
  accounts: { name: string; type: string } | null
}

export function DeleteTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: Transaction
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
        .from("transactions")
        .delete()
        .eq("id", transaction.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
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
            Delete Transaction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description:</span>
              <span className="text-sm font-medium">{transaction.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className={`text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm">{formatDate(transaction.date, "long")}</span>
            </div>
            {transaction.categories && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm">{transaction.categories.name}</span>
              </div>
            )}
            {transaction.accounts && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account:</span>
                <span className="text-sm">{transaction.accounts.name}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This action cannot be undone.
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
            {loading ? "Deleting..." : "Delete Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

