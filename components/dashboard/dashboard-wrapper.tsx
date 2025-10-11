"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Calendar } from "lucide-react"
import { DashboardOverview } from "./overview"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]

export function DashboardWrapper({ userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // Default to current month (YYYY-MM)
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: accountsData } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)

      setAccounts(accountsData || [])
    }

    fetchAccounts()
  }, [userId, supabase])

  // Generate last 12 months options
  const generateMonthOptions = () => {
    const months = []
    const now = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      months.push({ value, label })
    }
    
    return months
  }

  const monthOptions = generateMonthOptions()

  return (
    <>
      {/* Filters in Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your financial data
            </p>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Month Filter */}
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DashboardOverview 
        userId={userId} 
        selectedAccountId={selectedAccountId}
        selectedMonth={selectedMonth}
      />
    </>
  )
}

