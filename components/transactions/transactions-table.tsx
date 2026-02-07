"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, formatDate, formatMonth } from "@/lib/utils"
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { BulkActionsBar } from "./bulk-actions-bar"
import { ConfirmDeleteModal } from "./confirm-delete-modal"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRowSelection } from "@/lib/hooks/use-row-selection"
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

function getMonthKey(dateValue: string) {
  const date = parseDateOnly(dateValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function getMonthLabel(dateValue: string) {
  return formatMonth(dateValue)
}

export function TransactionsTable({
  transactions,
  accounts,
  categories,
  userId,
  selectionScopeKey,
}: {
  transactions: Transaction[]
  accounts: Account[]
  categories: Category[]
  userId: string
  selectionScopeKey: string
}) {
  const t = useTranslations("transactions")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false)
  const [deletingBulk, setDeletingBulk] = useState(false)
  const [failedRowIds, setFailedRowIds] = useState<Set<string>>(new Set())

  const {
    selectedIdsArray,
    selectedCount,
    isSelected,
    toggleRow,
    toggleAllVisible,
    clearSelection,
    replaceSelection,
  } = useRowSelection()

  const visibleIds = useMemo(() => transactions.map((transaction) => transaction.id), [transactions])

  useEffect(() => {
    clearSelection()
    setFailedRowIds(new Set())
    setExpandedIds(new Set())
  }, [clearSelection, selectionScopeKey])

  useEffect(() => {
    const visibleSet = new Set(visibleIds)
    const selectedVisible = selectedIdsArray.filter((id) => visibleSet.has(id))

    if (selectedVisible.length !== selectedIdsArray.length) {
      replaceSelection(selectedVisible)
    }

    setFailedRowIds((previous) => {
      const next = new Set(Array.from(previous).filter((id) => visibleSet.has(id)))
      if (next.size === previous.size) {
        return previous
      }
      return next
    })
  }, [replaceSelection, visibleIds, selectedIdsArray])

  const visibleSelectedCount = useMemo(
    () => visibleIds.filter((id) => selectedIdsArray.includes(id)).length,
    [visibleIds, selectedIdsArray]
  )

  const allVisibleSelected = visibleIds.length > 0 && visibleSelectedCount === visibleIds.length
  const headerCheckedState: boolean | "indeterminate" =
    visibleSelectedCount === 0
      ? false
      : allVisibleSelected
      ? true
      : "indeterminate"

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, { monthLabel: string; items: Transaction[] }>()

    transactions.forEach((transaction) => {
      const monthKey = getMonthKey(transaction.date)
      const currentGroup = groups.get(monthKey)

      if (!currentGroup) {
        groups.set(monthKey, {
          monthLabel: getMonthLabel(transaction.date),
          items: [transaction],
        })
        return
      }

      currentGroup.items.push(transaction)
    })

    return Array.from(groups.entries()).map(([monthKey, group]) => ({
      monthKey,
      monthLabel: group.monthLabel,
      items: group.items,
    }))
  }, [transactions])

  const transactionsById = useMemo(() => {
    const map = new Map<string, Transaction>()
    transactions.forEach((transaction) => map.set(transaction.id, transaction))
    return map
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

  const handleRowToggle = (id: string) => {
    setFailedRowIds((previous) => {
      if (!previous.has(id)) {
        return previous
      }

      const next = new Set(previous)
      next.delete(id)
      return next
    })

    toggleRow(id)
  }

  const handleToggleAllVisible = () => {
    setFailedRowIds(new Set())
    toggleAllVisible(visibleIds)
  }

  const formatFailedTransaction = (id: string) => {
    const transaction = transactionsById.get(id)
    if (!transaction) {
      return `ID: ${id}`
    }

    return `${formatDate(transaction.date, "short")} - ${transaction.description} - ${formatCurrency(transaction.amount)}`
  }

  const handleBulkDelete = async () => {
    if (selectedIdsArray.length === 0 || deletingBulk) {
      return
    }

    setDeletingBulk(true)

    try {
      const idsToDelete = [...selectedIdsArray]
      const { data, error } = await supabase
        .from("transactions")
        .delete()
        .eq("user_id", userId)
        .in("id", idsToDelete)
        .select("id")

      if (error) {
        throw error
      }

      const deletedIds = new Set((data || []).map((row) => row.id))
      const failedIds = idsToDelete.filter((id) => !deletedIds.has(id))
      const deletedCount = deletedIds.size

      if (failedIds.length === 0) {
        clearSelection()
        setFailedRowIds(new Set())
        toast({
          title: "Transacciones borradas",
          description:
            deletedCount === 1
              ? "Se borró 1 transacción."
              : `Se borraron ${deletedCount} transacciones.`,
        })
      } else {
        replaceSelection(failedIds)
        setFailedRowIds(new Set(failedIds))

        toast({
          title: "Borrado parcial",
          description: (
            <div className="space-y-2">
              <p>{deletedCount} borradas, {failedIds.length} no se han podido borrar.</p>
              <ul className="list-disc pl-4 text-xs">
                {failedIds.map((id) => (
                  <li key={id}>{formatFailedTransaction(id)}</li>
                ))}
              </ul>
            </div>
          ),
          variant: "destructive",
        })
      }

      setConfirmBulkDeleteOpen(false)

      if (deletedCount > 0) {
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron borrar las transacciones.",
        variant: "destructive",
      })
    } finally {
      setDeletingBulk(false)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center">
        <p className="text-muted-foreground">{t("noTransactions")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          deleting={deletingBulk}
          onDelete={() => setConfirmBulkDeleteOpen(true)}
          onClearSelection={() => {
            clearSelection()
            setFailedRowIds(new Set())
          }}
        />
      )}

      <div className="space-y-3 md:hidden">
        {groupedTransactions.map((group) => (
          <div key={group.monthKey} className="space-y-2">
            <div className="sticky top-[4.25rem] z-20 -mx-1 bg-background/95 px-1 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
              {group.monthLabel}
            </div>

            {group.items.map((transaction) => {
              const isExpanded = expandedIds.has(transaction.id)
              const isFailed = failedRowIds.has(transaction.id)

              return (
                <div
                  key={transaction.id}
                  className={`rounded-lg border bg-card ${isFailed ? "border-destructive" : ""}`}
                >
                  <div className="flex items-start gap-3 px-4 pt-3">
                    <Checkbox
                      aria-label={`Seleccionar transacción ${transaction.description}`}
                      checked={isSelected(transaction.id)}
                      onCheckedChange={() => handleRowToggle(transaction.id)}
                      className="mt-1"
                    />
                    <button
                      type="button"
                      className="w-full touch-manipulation pb-3 text-left"
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
                            className={`text-right text-sm font-semibold ${
                              transaction.amount >= 0 ? "text-green-600" : "text-red-600"
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
                  </div>

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
              <TableHead className="w-[44px]">
                <Checkbox
                  aria-label="Seleccionar todas las transacciones visibles"
                  checked={headerCheckedState}
                  onCheckedChange={handleToggleAllVisible}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedTransactions.map((group) => (
              <Fragment key={`month-fragment-${group.monthKey}`}>
                <TableRow key={`month-${group.monthKey}`} className="bg-muted/40 hover:bg-muted/40">
                  <TableCell colSpan={7} className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.monthLabel}
                  </TableCell>
                </TableRow>

                {group.items.map((transaction) => {
                  const isFailed = failedRowIds.has(transaction.id)

                  return (
                    <TableRow key={transaction.id} className={isFailed ? "bg-destructive/10" : ""}>
                      <TableCell>
                        <Checkbox
                          aria-label={`Seleccionar transacción ${transaction.description}`}
                          checked={isSelected(transaction.id)}
                          onCheckedChange={() => handleRowToggle(transaction.id)}
                        />
                      </TableCell>
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
                          className={`font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}
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
                            aria-label={`Editar transacción ${transaction.description}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeletingTransaction(transaction)}
                            aria-label={`Eliminar transacción ${transaction.description}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </Fragment>
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

      <ConfirmDeleteModal
        open={confirmBulkDeleteOpen}
        count={selectedCount}
        loading={deletingBulk}
        onOpenChange={setConfirmBulkDeleteOpen}
        onConfirm={handleBulkDelete}
      />
    </div>
  )
}
