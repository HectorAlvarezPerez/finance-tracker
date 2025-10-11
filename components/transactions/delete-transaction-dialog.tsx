"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
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
import { ToastAction } from "@/components/ui/toast"
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
  const t = useTranslations('dialogs.deleteTransaction')
  const tForms = useTranslations('forms')
  const tMsg = useTranslations('messages')

  const handleDelete = async () => {
    setLoading(true)

    try {
      // Save transaction data before deleting for undo functionality
      const deletedTransaction = {
        user_id: transaction.user_id,
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        status: transaction.status,
        notes: transaction.notes,
      }

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transaction.id)

      if (error) throw error

      // Show success toast with undo option
      toast({
        title: tMsg('success'),
        description: t('message'),
        action: (
          <ToastAction
            altText="Undo delete"
            onClick={async () => {
              try {
                const { error: undoError } = await supabase
                  .from("transactions")
                  .insert(deletedTransaction)

                if (undoError) throw undoError

                toast({
                  title: "Transaction restored",
                  description: "The transaction has been restored successfully",
                })

                router.refresh()
              } catch (undoError: any) {
                toast({
                  title: tMsg('error'),
                  description: "Failed to restore transaction",
                  variant: "destructive",
                })
              }
            }}
          >
            Undo
          </ToastAction>
        ),
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: tMsg('error'),
        description: error.message || tMsg('error'),
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
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('message')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{tForms('description')}:</span>
              <span className="text-sm font-medium">{transaction.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{tForms('amount')}:</span>
              <span className={`text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{tForms('date')}:</span>
              <span className="text-sm">{formatDate(transaction.date, "long")}</span>
            </div>
            {transaction.categories && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{tForms('category')}:</span>
                <span className="text-sm">{transaction.categories.name}</span>
              </div>
            )}
            {transaction.accounts && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{tForms('account')}:</span>
                <span className="text-sm">{transaction.accounts.name}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('description')}
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {tForms('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? tForms('deleting') : t('title')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

