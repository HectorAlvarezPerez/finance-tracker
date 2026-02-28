import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { SmartCSVImportDialog } from "@/components/transactions/smart-csv-import-dialog"

export const dynamic = "force-dynamic"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerClient()
  const t = await getTranslations("transactions")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Await searchParams
  const params = await searchParams
  const getParam = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value[0]
    }
    return value
  }

  const selectedYear = getParam(params.year)
  const selectedMonth = getParam(params.month)
  const selectionScopeParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => selectionScopeParams.append(key, item))
      return
    }
    if (typeof value === "string") {
      selectionScopeParams.set(key, value)
    }
  })
  const selectionScopeKey = selectionScopeParams.toString()

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
    .select(
      "id, user_id, description, amount, currency, date, category_id, account_id, notes, created_at, updated_at, categories(name, color, icon), accounts(name, type)"
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (params.account) {
    query = query.eq("account_id", params.account as string)
  }

  if (params.category) {
    query = query.eq("category_id", params.category as string)
  }

  if (selectedYear) {
    const year = Number(selectedYear)

    if (!Number.isNaN(year)) {
      if (selectedMonth) {
        const month = Number(selectedMonth)
        if (!Number.isNaN(month) && month >= 1 && month <= 12) {
          const fromDate = `${year}-${String(month).padStart(2, "0")}-01`
          const toDate = `${year}-${String(month).padStart(2, "0")}-${String(
            new Date(year, month, 0).getDate()
          ).padStart(2, "0")}`
          query = query.gte("date", fromDate).lte("date", toDate)
        } else {
          query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`)
        }
      } else {
        query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`)
      }
    }
  }

  if (params.startDate) {
    query = query.gte("date", params.startDate as string)
  }

  if (params.endDate) {
    query = query.lte("date", params.endDate as string)
  }

  if (params.search) {
    query = query.ilike("description", `%${params.search}%`)
  }

  const { data: rawTransactions } = await query.limit(100)

  const transactions = rawTransactions?.map((t: any) => ({
    ...t,
    categories: Array.isArray(t.categories) ? t.categories[0] : t.categories,
    accounts: Array.isArray(t.accounts) ? t.accounts[0] : t.accounts,
  }))

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
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

      <div className="sticky top-0 z-30 -mx-4 border-y bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
        <TransactionFilters accounts={accounts || []} categories={categories || []} />
      </div>

      <TransactionsTable
        transactions={transactions || []}
        accounts={accounts || []}
        categories={categories || []}
        userId={user.id}
        selectionScopeKey={selectionScopeKey}
      />
    </div>
  )
}
