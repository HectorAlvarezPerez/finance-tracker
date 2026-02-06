"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: { name: string; color: string; icon: string } | null
  accounts: { name: string; type: string } | null
}

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00`)
}

function getDateGroupLabel(dateValue: string) {
  const date = parseDateOnly(dateValue)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.getTime() === today.getTime()) {
    return "Today"
  }

  if (date.getTime() === yesterday.getTime()) {
    return "Yesterday"
  }

  return formatDate(date, "medium")
}

export function TransactionsTable({
  transactions,
  accounts,
  categories,
  userId,
}: {
  transactions: Transaction[]
  accounts: Account[]
  categories: Category[]
  userId: string
}) {
  const t = useTranslations('transactions')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, Transaction[]>()

    transactions.forEach((transaction) => {
      const current = groups.get(transaction.date) || []
      current.push(transaction)
      groups.set(transaction.date, current)
    })

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      label: getDateGroupLabel(date),
      items,
    }))
  }, [transactions])

  const toggleExpanded = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center">
        <p className="text-muted-foreground">{t('noTransactions')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 md:hidden">
        {groupedTransactions.map((group) => (
          <div key={group.date} className="space-y-2">
            <div className="sticky top-[4.25rem] z-20 -mx-1 bg-background/95 px-1 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
              {group.label}
            </div>

            {group.items.map((transaction) => {
              const isExpanded = expandedIds.has(transaction.id)

              return (
                <div key={transaction.id} className="rounded-lg border bg-card">
                  <button
                    type="button"
                    className="w-full touch-manipulation px-4 py-3 text-left"
                    onClick={() => toggleExpanded(transaction.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium">{transaction.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(transaction.date, "short")}</p>
                      </div>
                      <div className="flex shrink-0 items-start gap-2">
                        <span
                          className={`text-right text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
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
                      <span className="text-xs text-muted-foreground">{transaction.accounts?.name}</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 border-t px-4 py-3">
                      {transaction.notes && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
                          <p className="text-sm text-muted-foreground">{transaction.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10"
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 text-destructive"
                          onClick={() => setDeletingTransaction(transaction)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="hidden rounded-md border md:block">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(transaction.date, "short")}
                </TableCell>
                <TableCell className="max-w-[260px] truncate font-medium">{transaction.description}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {transaction.accounts?.name}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeletingTransaction(transaction)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          accounts={accounts}
          categories={categories}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}

      {deletingTransaction && (
        <DeleteTransactionDialog
          transaction={deletingTransaction}
          open={!!deletingTransaction}
          onOpenChange={(open) => !open && setDeletingTransaction(null)}
        />
      )}
    </div>
  )
}
