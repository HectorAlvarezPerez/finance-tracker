"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, DollarSign, Filter } from "lucide-react"
import { SpendingChart } from "./spending-chart"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
}

export function DashboardOverview({ userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<{ account_id: string; amount: number }[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Get all accounts
      const { data: accountsData } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)

      setAccounts(accountsData || [])

      // Get transactions for current month
      const currentMonth = new Date()
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        .toISOString()
        .split("T")[0]
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0]

      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", userId)
        .gte("date", firstDay)
        .lte("date", lastDay)

      setTransactions(transactionsData || [])

      // Get all transactions for balance calculation
      const { data: allTransactionsData } = await supabase
        .from("transactions")
        .select("account_id, amount")
        .eq("user_id", userId)

      setAllTransactions(allTransactionsData || [])
      setLoading(false)
    }

    fetchData()
  }, [userId, supabase])

  // Filter transactions by selected account
  const filteredTransactions = selectedAccountId === "all"
    ? transactions
    : transactions.filter((t) => t.account_id === selectedAccountId)

  // Calculate totals (only transactions with categories)
  const income = filteredTransactions
    .filter((t) => t.amount > 0 && t.category_id !== null)
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = Math.abs(
    filteredTransactions
      .filter((t) => t.amount < 0 && t.category_id !== null)
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const netCash = income - expenses

  // Calculate account balances from all transactions
  const accountBalances = new Map<string, number>()
  allTransactions.forEach((t) => {
    const current = accountBalances.get(t.account_id) || 0
    accountBalances.set(t.account_id, current + t.amount)
  })

  // For filtered view, calculate total balance based on selected account
  const totalBalance = selectedAccountId === "all"
    ? Array.from(accountBalances.values()).reduce((sum, val) => sum + val, 0)
    : accountBalances.get(selectedAccountId) || 0

  // Filter accounts to display based on selection
  const displayAccounts = selectedAccountId === "all"
    ? accounts
    : accounts.filter((a) => a.id === selectedAccountId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      {/* Account Filter */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Account</label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedAccountId !== "all" && (
              <p className="text-sm text-muted-foreground">
                Showing data for selected account only
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedAccountId === "all" 
                ? `Across ${accounts.length} accounts`
                : `${accounts.find(a => a.id === selectedAccountId)?.name || "Selected account"}`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(income)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.amount > 0 && t.category_id !== null).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.amount < 0 && t.category_id !== null).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netCash >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(netCash)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Accounts List */}
        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayAccounts && displayAccounts.length > 0 ? (
                displayAccounts.map((account) => {
                  const balance = accountBalances.get(account.id) || 0
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          account.type === 'checking' ? 'bg-blue-500' :
                          account.type === 'savings' ? 'bg-green-500' :
                          account.type === 'brokerage' ? 'bg-purple-500' :
                          account.type === 'crypto' ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{account.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(balance)}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {selectedAccountId === "all" 
                    ? "No accounts found. Create one to get started."
                    : "Account not found."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spending Chart - Now smaller */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart transactions={filteredTransactions} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

