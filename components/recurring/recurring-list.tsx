"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Calendar, Repeat, MoreHorizontal, Edit, Trash2, Play, Pause } from "lucide-react"
import type { Database } from "@/types/database"
import { EditRecurringDialog } from "./edit-recurring-dialog"
import { DeleteRecurringDialog } from "./delete-recurring-dialog"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

type RecurringTransaction = Database["public"]["Tables"]["recurring_transactions"]["Row"] & {
  categories: { id: string; name: string; color: string } | null
  accounts: { id: string; name: string; type: string } | null
}

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

function getFrequencyLabel(frequency: string, intervalValue: number): string {
  const labels: Record<string, string> = {
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
    yearly: "Year",
  }
  
  const label = labels[frequency] || frequency
  return intervalValue === 1 ? `Every ${label}` : `Every ${intervalValue} ${label}s`
}

function getDayLabel(frequency: string, dayOfMonth?: number | null, dayOfWeek?: number | null): string {
  if (frequency === "monthly" && dayOfMonth) {
    return `on the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`
  }
  if (frequency === "weekly" && dayOfWeek !== null && dayOfWeek !== undefined) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return `on ${days[dayOfWeek]}`
  }
  return ""
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th"
  switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}

export function RecurringTransactionsList({
  recurringTransactions,
  accounts,
  categories,
  userId,
}: {
  recurringTransactions: RecurringTransaction[]
  accounts: Account[]
  categories: Category[]
  userId: string
}) {
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null)
  const [deletingRecurring, setDeletingRecurring] = useState<RecurringTransaction | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const handleToggleEnabled = async (recurring: RecurringTransaction) => {
    try {
      const { error } = await supabase
        .from("recurring_transactions")
        .update({ enabled: !recurring.enabled })
        .eq("id", recurring.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Recurring transaction ${recurring.enabled ? "paused" : "enabled"}`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recurring transaction",
        variant: "destructive",
      })
    }
  }

  if (recurringTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Repeat className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recurring transactions yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Set up automated recurring transactions for things like salary, rent, or subscriptions
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {recurringTransactions.map((recurring) => (
          <Card key={recurring.id} className={!recurring.enabled ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{recurring.description}</CardTitle>
                    {!recurring.enabled && (
                      <Badge variant="secondary">Paused</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Repeat className="h-4 w-4" />
                      {getFrequencyLabel(recurring.frequency, recurring.interval_value)}
                      {" "}
                      {getDayLabel(recurring.frequency, recurring.day_of_month, recurring.day_of_week)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Next: {formatDate(recurring.next_run_at, "short")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`text-xl font-bold ${recurring.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {recurring.amount >= 0 ? "+" : ""}
                      {formatCurrency(recurring.amount)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleEnabled(recurring)}>
                        {recurring.enabled ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingRecurring(recurring)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingRecurring(recurring)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="text-sm font-medium">{recurring.accounts?.name || "Unknown"}</p>
                </div>
                {recurring.categories && (
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: recurring.categories.color,
                        color: recurring.categories.color,
                      }}
                    >
                      {recurring.categories.name}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="text-sm font-medium">{recurring.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingRecurring && (
        <EditRecurringDialog
          recurring={editingRecurring}
          accounts={accounts}
          categories={categories}
          open={!!editingRecurring}
          onOpenChange={(open) => !open && setEditingRecurring(null)}
        />
      )}

      {deletingRecurring && (
        <DeleteRecurringDialog
          recurring={deletingRecurring}
          open={!!deletingRecurring}
          onOpenChange={(open) => !open && setDeletingRecurring(null)}
        />
      )}
    </>
  )
}

