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
  const t = useTranslations('forms')
  const tDialog = useTranslations('dialogs.addRecurring')
  const tFreq = useTranslations('recurring.frequency')
  const tMessages = useTranslations('messages')
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
        title: tMessages('success'),
        description: tDialog('success'),
      })

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      toast({
        title: tMessages('error'),
        description: error.message || tDialog('error'),
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
          {tDialog('title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{tDialog('title')}</DialogTitle>
            <DialogDescription>
              {tDialog('subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount')}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">{t('account')}</Label>
              <Select value={accountId} onValueChange={setAccountId} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectAccount')} />
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
              <Label htmlFor="category">{t('category')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('noCategory')}</SelectItem>
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
                <Label htmlFor="frequency">{t('frequency')}</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{tFreq('daily')}</SelectItem>
                    <SelectItem value="weekly">{tFreq('weekly')}</SelectItem>
                    <SelectItem value="monthly">{tFreq('monthly')}</SelectItem>
                    <SelectItem value="yearly">{tFreq('yearly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval">{t('interval')}</Label>
                <Input
                  id="interval"
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
                <Label htmlFor="dayOfMonth">{t('dayOfMonth')}</Label>
                <Input
                  id="dayOfMonth"
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
                <Label htmlFor="dayOfWeek">{t('dayOfWeek')}</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('sunday')}</SelectItem>
                    <SelectItem value="1">{t('monday')}</SelectItem>
                    <SelectItem value="2">{t('tuesday')}</SelectItem>
                    <SelectItem value="3">{t('wednesday')}</SelectItem>
                    <SelectItem value="4">{t('thursday')}</SelectItem>
                    <SelectItem value="5">{t('friday')}</SelectItem>
                    <SelectItem value="6">{t('saturday')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('creating') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

