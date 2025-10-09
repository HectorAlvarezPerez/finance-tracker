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

type RecurringTransaction = Database["public"]["Tables"]["recurring_transactions"]["Row"]
type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function EditRecurringDialog({
  recurring,
  accounts,
  categories,
  open,
  onOpenChange,
}: {
  recurring: RecurringTransaction
  accounts: Account[]
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState(recurring.description)
  const [amount, setAmount] = useState(recurring.amount.toString())
  const [accountId, setAccountId] = useState(recurring.account_id)
  const [categoryId, setCategoryId] = useState(recurring.category_id || "none")
  const [frequency, setFrequency] = useState(recurring.frequency)
  const [intervalValue, setIntervalValue] = useState(recurring.interval_value.toString())
  const [dayOfMonth, setDayOfMonth] = useState((recurring.day_of_month || 1).toString())
  const [dayOfWeek, setDayOfWeek] = useState((recurring.day_of_week || 1).toString())
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    setDescription(recurring.description)
    setAmount(recurring.amount.toString())
    setAccountId(recurring.account_id)
    setCategoryId(recurring.category_id || "none")
    setFrequency(recurring.frequency)
    setIntervalValue(recurring.interval_value.toString())
    setDayOfMonth((recurring.day_of_month || 1).toString())
    setDayOfWeek((recurring.day_of_week || 1).toString())
  }, [recurring])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("recurring_transactions")
        .update({
          description,
          amount: parseFloat(amount),
          account_id: accountId,
          category_id: categoryId === "none" ? null : categoryId,
          frequency,
          interval_value: parseInt(intervalValue),
          day_of_month: frequency === "monthly" ? parseInt(dayOfMonth) : null,
          day_of_week: frequency === "weekly" ? parseInt(dayOfWeek) : null,
        } as any)
        .eq("id", recurring.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Recurring transaction updated successfully",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recurring transaction",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Recurring Transaction</DialogTitle>
            <DialogDescription>
              Update your recurring transaction details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-account">Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="edit-category">Category (Optional)</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-interval">Every</Label>
                <Input
                  id="edit-interval"
                  type="number"
                  min="1"
                  value={intervalValue}
                  onChange={(e) => setIntervalValue(e.target.value)}
                  required
                />
              </div>
            </div>
            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="edit-dayOfMonth">Day of Month</Label>
                <Input
                  id="edit-dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  required
                />
              </div>
            )}
            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="edit-dayOfWeek">Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

