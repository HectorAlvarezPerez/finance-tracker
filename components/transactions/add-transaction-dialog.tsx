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
import { Plus, X } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function AddTransactionDialog({
  userId,
  accounts,
  categories,
}: {
  userId: string
  accounts: Account[]
  categories: Category[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [txnType, setTxnType] = useState<'expense' | 'income'>('expense')
  const [accountId, setAccountId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('dialogs.addTransaction')
  const tForms = useTranslations('forms')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const parsedAmount = parseFloat(amount)
      const signedAmount = txnType === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount)
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        account_id: accountId,
        date,
        description,
        amount: signedAmount,
        category_id: categoryId || null,
        notes: notes || null,
        status: "posted",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Transaction added successfully",
      })

      setOpen(false)
      setDescription("")
      setAmount("")
      setTxnType('expense')
      setNotes("")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
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
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>
              {t('subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="txnType">{tForms('transactionType')}</Label>
              <Select value={txnType} onValueChange={(v) => setTxnType(v as 'expense' | 'income')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">{tForms('expense')}</SelectItem>
                  <SelectItem value="income">{tForms('income')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{tForms('date')}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{tForms('description')}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">{tForms('amount')}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value
                  // Keep only digits and a single dot; strip negatives
                  const sanitized = raw
                    .replace(/-/g, '')
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                  setAmount(sanitized)
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">{tForms('account')}</Label>
              <Select value={accountId} onValueChange={setAccountId} required>
                <SelectTrigger>
                  <SelectValue placeholder={tForms('selectAccount')} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{tForms('category')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={tForms('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{tForms('notes')}</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {tForms('cancel')}
            </Button>
            <Button type="submit" disabled={loading || !accountId}>
              {loading ? tForms('saving') : t('title')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

