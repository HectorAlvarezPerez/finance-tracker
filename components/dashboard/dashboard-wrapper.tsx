"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter } from "lucide-react"
import { DashboardOverview } from "./overview"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]

export function DashboardWrapper({ userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all")

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

  return (
    <>
      {/* Account Filter in Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your financial data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-full md:w-[240px]">
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

      <DashboardOverview userId={userId} selectedAccountId={selectedAccountId} />
    </>
  )
}

