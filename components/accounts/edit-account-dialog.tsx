"use client"

import { useState, useEffect } from "react"
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

type Account = Database["public"]["Tables"]["accounts"]["Row"]

export function EditAccountDialog({
  account,
  open,
  onOpenChange,
}: {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<string>(account.type)
  const [currency, setCurrency] = useState(account.currency)
  const [balanceAdjustment, setBalanceAdjustment] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations("dialogs.editAccount")
  const tForms = useTranslations("forms")
  const tMsg = useTranslations("messages")
  const tTypes = useTranslations("accountTypes")

  useEffect(() => {
    setName(account.name)
    setType(account.type)
    setCurrency(account.currency)
    setBalanceAdjustment("")
  }, [account])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update the account
      const { error } = await supabase
        .from("accounts")
        .update({
          name,
          type: type as Account["type"],
          currency,
        })
        .eq("id", account.id)

      if (error) throw error

      // If there's a balance adjustment, create a transaction
      if (balanceAdjustment && parseFloat(balanceAdjustment) !== 0) {
        const { data: userData } = await supabase.auth.getUser()

        const { error: transactionError } = await supabase.from("transactions").insert({
          user_id: userData.user?.id,
          account_id: account.id,
          description: "Balance Adjustment",
          amount: parseFloat(balanceAdjustment),
          date: new Date().toISOString().split("T")[0],
          category_id: null,
        })

        if (transactionError) {
          console.error("Error creating balance adjustment transaction:", transactionError)
        }
      }

      toast({
        title: tMsg("success"),
        description: t("success"),
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: tMsg("error"),
        description: error.message || t("error"),
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
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{tForms("name")}</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">{tForms("type")}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">{tTypes("checking")}</SelectItem>
                  <SelectItem value="savings">{tTypes("savings")}</SelectItem>
                  <SelectItem value="brokerage">{tTypes("brokerage")}</SelectItem>
                  <SelectItem value="crypto">{tTypes("crypto")}</SelectItem>
                  <SelectItem value="other">{tTypes("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-currency">{tForms("currency")}</Label>
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                <span className="text-sm">EUR 🇪🇺</span>
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balanceAdjustment">{tForms("balanceAdjustment")}</Label>
              <Input
                id="balanceAdjustment"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={balanceAdjustment}
                onChange={(e) => setBalanceAdjustment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add/subtract amount to adjust current balance
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tForms("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tForms("updating") : tForms("update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
