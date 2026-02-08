"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStatusClassName, getStatusLabel, type BudgetProgressItem } from "@/lib/budgets/helpers"
import { formatCurrency, formatDate } from "@/lib/utils"

function ProgressBar({ usagePct }: { usagePct: number }) {
  const safeValue = Math.max(0, usagePct)
  const width = Math.min(100, safeValue)

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full ${safeValue > 100 ? "bg-red-500" : safeValue >= 80 ? "bg-amber-500" : "bg-emerald-500"}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export function BudgetDetailPanel({
  item,
  periodLabel,
  onEdit,
}: {
  item: BudgetProgressItem
  periodLabel: string
  onEdit: () => void
}) {
  const topTransactions = [...item.transactions]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5)

  const maxBreakdownAmount = item.breakdown.reduce(
    (max, entry) => (entry.amount > max ? entry.amount : max),
    0
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{item.budget.categories?.name ?? "Sin categoria"}</h3>
          <Badge className={getStatusClassName(item.status)}>{getStatusLabel(item.status)}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">Periodo: {periodLabel}</p>
      </div>

      <div className="rounded-lg border bg-muted/20 p-3">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Presupuesto</p>
            <p className="font-semibold">{formatCurrency(Number(item.budget.amount), "EUR", "es-ES")}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Gastado</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(item.spent, "EUR", "es-ES")}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Disponible</p>
            <p className={`font-semibold ${item.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {formatCurrency(item.remaining, "EUR", "es-ES")}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>{item.usagePct.toFixed(1)}%</span>
          </div>
          <ProgressBar usagePct={item.usagePct} />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <h4 className="text-sm font-semibold">Evolucion del gasto</h4>
        <div className="space-y-2">
          {item.breakdown.map((entry) => {
            const ratio = maxBreakdownAmount > 0 ? (entry.amount / maxBreakdownAmount) * 100 : 0

            return (
              <div key={entry.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{entry.label}</span>
                  <span>{formatCurrency(entry.amount, "EUR", "es-ES")}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${ratio}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <h4 className="text-sm font-semibold">Top transacciones</h4>
        {topTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay gastos de esta categoria en el periodo.</p>
        ) : (
          <div className="space-y-2">
            {topTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date, "short")}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-red-600">
                  {formatCurrency(Math.abs(transaction.amount), "EUR", "es-ES")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="h-11 w-full" onClick={onEdit}>
        Editar presupuesto
      </Button>
    </div>
  )
}
