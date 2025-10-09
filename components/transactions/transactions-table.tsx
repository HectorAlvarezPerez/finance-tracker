"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Edit, Trash2, Download } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import type { Database } from "@/types/database"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null
  accounts: { name: string; type: string } | null
}

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

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
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)


  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Amount", "Category", "Account", "Status", "Notes"]
    const rows = transactions.map((t) => [
      t.date,
      t.description,
      t.amount.toString(),
      t.categories?.name || "",
      t.accounts?.name || "",
      t.status,
      t.notes || "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Transactions exported successfully",
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(transaction.date, "short")}
                </TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
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
                    className={`font-semibold ${
                      transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.status === "posted" ? "default" : "outline"}>
                    {transaction.status}
                  </Badge>
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

