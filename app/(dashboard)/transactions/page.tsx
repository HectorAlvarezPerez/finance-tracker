import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { SmartCSVImportDialog } from "@/components/transactions/smart-csv-import-dialog"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()
  const t = await getTranslations('transactions')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get accounts for filters
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)

  // Get categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name")

  // Build query based on filters
  let query = supabase
    .from("transactions")
    .select("*, categories(name, color, icon), accounts(name, type)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (searchParams.account) {
    query = query.eq("account_id", searchParams.account as string)
  }

  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category as string)
  }

  if (searchParams.startDate) {
    query = query.gte("date", searchParams.startDate as string)
  }

  if (searchParams.endDate) {
    query = query.lte("date", searchParams.endDate as string)
  }

  if (searchParams.search) {
    query = query.ilike("description", `%${searchParams.search}%`)
  }

  const { data: transactions } = await query.limit(100)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <SmartCSVImportDialog
            userId={user.id}
            accounts={accounts || []}
            categories={categories || []}
          />
          <AddTransactionDialog
            userId={user.id}
            accounts={accounts || []}
            categories={categories || []}
          />
        </div>
      </div>

      <TransactionFilters
        accounts={accounts || []}
        categories={categories || []}
      />

      <TransactionsTable
        transactions={transactions || []}
        accounts={accounts || []}
        categories={categories || []}
        userId={user.id}
      />
    </div>
  )
}

