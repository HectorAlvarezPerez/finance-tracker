"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { Wallet, TrendingUp, Landmark, Bitcoin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { Database } from "@/types/database"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { EditAccountDialog } from "./edit-account-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { useTranslations } from "next-intl"

type Account = Database["public"]["Tables"]["accounts"]["Row"]

const accountIcons = {
  checking: Landmark,
  savings: Wallet,
  brokerage: TrendingUp,
  crypto: Bitcoin,
  other: Wallet,
}

const accountColors = {
  checking: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  savings: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
  brokerage: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
  crypto: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700",
  other: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
}

export function AccountsList({ accounts, userId }: { accounts: Account[]; userId: string }) {
  const [balances, setBalances] = useState<Map<string, number>>(new Map())
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const supabase = createBrowserClient()
  const t = useTranslations('accounts')

  useEffect(() => {
    async function fetchBalances() {
      const balanceMap = new Map<string, number>()
      
      for (const account of accounts) {
        const { data } = await supabase
          .from("transactions")
          .select("amount")
          .eq("account_id", account.id)

        const balance = data?.reduce((sum, t) => sum + t.amount, 0) || 0
        balanceMap.set(account.id, balance)
      }

      setBalances(balanceMap)
    }

    fetchBalances()
  }, [accounts, supabase])

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('noAccounts')}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {t('addFirstAccount')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type as keyof typeof accountIcons]
          const balance = balances.get(account.id) || 0

          return (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {account.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${accountColors[account.type as keyof typeof accountColors]}`}
                  >
                    {account.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingAccount(account)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(balance, account.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingAccount && (
        <EditAccountDialog
          account={editingAccount}
          open={!!editingAccount}
          onOpenChange={(open) => !open && setEditingAccount(null)}
        />
      )}

      {deletingAccount && (
        <DeleteAccountDialog
          account={deletingAccount}
          open={!!deletingAccount}
          onOpenChange={(open) => !open && setDeletingAccount(null)}
        />
      )}
    </>
  )
}

