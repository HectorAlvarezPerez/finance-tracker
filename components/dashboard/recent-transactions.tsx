import { createServerClient } from "@/lib/supabase/server"
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function RecentTransactions({ userId }: { userId: string }) {
  const supabase = createServerClient()
  const t = await getTranslations('dashboard')

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, user_id, description, amount, currency, date, category_id, account_id, created_at, updated_at, categories(name, color), accounts(name)")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('recentTransactions')}</CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t('viewAll')} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noTransactionsYet')}</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date, "short")}
                    </p>
                    {transaction.categories && (
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: transaction.categories.color,
                          color: transaction.categories.color,
                        }}
                      >
                        {transaction.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`shrink-0 text-right text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {transaction.amount >= 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
