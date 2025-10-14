import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { RecurringTransactionsList } from "@/components/recurring/recurring-list"
import { AddRecurringDialog } from "@/components/recurring/add-recurring-dialog"

export const dynamic = 'force-dynamic'

export default async function RecurringPage() {
  const supabase = createServerClient()
  const t = await getTranslations('recurring')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get recurring transactions
  const { data: recurringTransactions } = await supabase
    .from("recurring_transactions")
    .select(`
      *,
      categories (id, name, color),
      accounts (id, name, type)
    `)
    .eq("user_id", user.id)
    .order("next_run_at", { ascending: true })

  // Get accounts for dialog
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("name")

  // Get categories for dialog
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name")

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <AddRecurringDialog
          userId={user.id}
          accounts={accounts || []}
          categories={categories || []}
        />
      </div>

      <RecurringTransactionsList
        recurringTransactions={recurringTransactions || []}
        accounts={accounts || []}
        categories={categories || []}
        userId={user.id}
      />
    </div>
  )
}

