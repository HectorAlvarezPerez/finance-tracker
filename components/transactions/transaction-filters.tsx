"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function TransactionFilters({
  accounts,
  categories,
}: {
  accounts: Account[]
  categories: Category[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""
  const [searchValue, setSearchValue] = useState(currentSearch)
  const selectedYear = searchParams.get("year") || "all"
  const selectedMonth = searchParams.get("month") || "all"

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, index) => String(currentYear - index))
  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/transactions?${params.toString()}`)
  }, [router, searchParams])

  const handleClearFilters = () => {
    router.push("/transactions")
  }

  const handleYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("year", value)
    } else {
      params.delete("year")
      params.delete("month")
    }
    router.push(`/transactions?${params.toString()}`)
  }

  const handleMonthChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      if (!params.get("year")) {
        params.set("year", String(currentYear))
      }
      params.set("month", value)
    } else {
      params.delete("month")
    }

    router.push(`/transactions?${params.toString()}`)
  }

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    const nextSearch = searchValue.trim()
    if (nextSearch === currentSearch) {
      return
    }

    const timer = window.setTimeout(() => {
      handleFilterChange("search", nextSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchValue, currentSearch, handleFilterChange])

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto_auto]">
      <div className="relative sm:col-span-2 xl:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <Select
        value={searchParams.get("account") || "all"}
        onValueChange={(value) => handleFilterChange("account", value)}
      >
        <SelectTrigger className="w-full sm:min-w-[180px]">
          <SelectValue placeholder="All Accounts" />
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

      <Select
        value={searchParams.get("category") || "all"}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger className="w-full sm:min-w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedYear}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-full sm:min-w-[130px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedMonth}
        onValueChange={handleMonthChange}
        disabled={selectedYear === "all"}
      >
        <SelectTrigger className="w-full sm:min-w-[150px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {monthOptions.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={handleClearFilters}>
          <X className="h-4 w-4" />
          <span className="sm:hidden">Clear filters</span>
        </Button>
      )}
    </div>
  )
}
