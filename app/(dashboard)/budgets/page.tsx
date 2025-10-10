import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { BudgetsList } from "@/components/budgets/budgets-list"
import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog"

export default async function BudgetsPage() {
  const supabase = createServerClient()
  const t = await getTranslations('budgets')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .order("name")

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01"

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, categories(name, color)")
    .eq("user_id", user.id)
    .eq("month", currentMonth)

  // Get transactions for the month
  const firstDay = currentMonth
  const lastDay = new Date(
    new Date(currentMonth).getFullYear(),
    new Date(currentMonth).getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0]

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", firstDay)
    .lte("date", lastDay)
    .lt("amount", 0)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <AddBudgetDialog userId={user.id} categories={categories || []} />
      </div>

      <BudgetsList
        budgets={budgets || []}
        transactions={transactions || []}
        userId={user.id}
      />
    </div>
  )
}

