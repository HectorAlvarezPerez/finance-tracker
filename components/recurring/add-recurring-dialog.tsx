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
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function AddRecurringDialog({
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
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [accountId, setAccountId] = useState("")
  const [categoryId, setCategoryId] = useState("none")
  const [frequency, setFrequency] = useState("monthly")
  const [intervalValue, setIntervalValue] = useState("1")
  const [dayOfMonth, setDayOfMonth] = useState("1")
  const [dayOfWeek, setDayOfWeek] = useState("1")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const calculateNextRunAt = (): string => {
    const date = new Date(startDate + "T00:00:00")
    
    switch (frequency) {
      case "daily":
        // Use start date as next run
        break
      case "weekly":
        // Adjust to next occurrence of dayOfWeek
        const targetDay = parseInt(dayOfWeek)
        const currentDay = date.getDay()
        const daysUntilTarget = (targetDay - currentDay + 7) % 7
        date.setDate(date.getDate() + daysUntilTarget)
        break
      case "monthly":
        // Set to specific day of month
        const targetDayOfMonth = parseInt(dayOfMonth)
        date.setDate(Math.min(targetDayOfMonth, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()))
        // If the date has passed this month, move to next month
        if (date < new Date()) {
          date.setMonth(date.getMonth() + 1)
          date.setDate(Math.min(targetDayOfMonth, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()))
        }
        break
      case "yearly":
        // Use start date, adjust year if needed
        if (date < new Date()) {
          date.setFullYear(date.getFullYear() + 1)
        }
        break
    }

    return date.toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const nextRunAt = calculateNextRunAt()

      const { error } = await supabase
        .from("recurring_transactions")
        .insert({
          user_id: userId,
          account_id: accountId,
          description,
          amount: parseFloat(amount),
          category_id: categoryId === "none" ? null : categoryId,
          currency: "EUR",
          frequency,
          interval_value: parseInt(intervalValue),
          day_of_month: frequency === "monthly" ? parseInt(dayOfMonth) : null,
          day_of_week: frequency === "weekly" ? parseInt(dayOfWeek) : null,
          next_run_at: nextRunAt,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          enabled: true,
        } as any)

      if (error) throw error

      toast({
        title: "Success",
        description: "Recurring transaction created successfully",
      })

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create recurring transaction",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDescription("")
    setAmount("")
    setAccountId("")
    setCategoryId("none")
    setFrequency("monthly")
    setIntervalValue("1")
    setDayOfMonth("1")
    setDayOfWeek("1")
    setStartDate(new Date().toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Recurring
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Recurring Transaction</DialogTitle>
            <DialogDescription>
              Set up an automated recurring transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Monthly Salary, Netflix Subscription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="e.g., 3000.00 or -15.99"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use negative for expenses, positive for income
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select value={accountId} onValueChange={setAccountId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
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
              <Label htmlFor="category">Category (Optional)</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
                <Label htmlFor="frequency">Frequency</Label>
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
                <Label htmlFor="interval">Every</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={intervalValue}
                  onChange={(e) => setIntervalValue(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  e.g., 1 = every {frequency}, 2 = every 2 {frequency}s
                </p>
              </div>
            </div>
            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="dayOfMonth">Day of Month</Label>
                <Input
                  id="dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Day of the month (1-31)
                </p>
              </div>
            )}
            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Day of Week</Label>
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
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                First occurrence will be on or after this date
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Recurring Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

