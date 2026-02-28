"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MONTH_OPTIONS, type BudgetPeriodType } from "@/lib/budgets/helpers"
import { cn } from "@/lib/utils"

export function BudgetsFiltersBar({
  periodType,
  year,
  month,
  periodLabel,
  onPeriodTypeChange,
  onYearChange,
  onMonthChange,
  onReset,
  onCreate,
}: {
  periodType: BudgetPeriodType
  year: number
  month: number
  periodLabel: string
  onPeriodTypeChange: (value: BudgetPeriodType) => void
  onYearChange: (value: number) => void
  onMonthChange: (value: number) => void
  onReset: () => void
  onCreate: () => void
}) {
  const currentYear = new Date().getFullYear()
  const baseYears = Array.from({ length: 9 }, (_, index) => currentYear - 5 + index)
  const years = Array.from(new Set([...baseYears, year])).sort((a, b) => b - a)

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Periodicidad
              </p>
              <div
                className="grid h-11 grid-cols-2 rounded-md border bg-muted/20 p-1"
                role="group"
                aria-label="Seleccionar periodicidad"
              >
                <button
                  type="button"
                  className={cn(
                    "rounded-sm text-sm font-medium transition-colors",
                    periodType === "monthly"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onPeriodTypeChange("monthly")}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-sm text-sm font-medium transition-colors",
                    periodType === "annual"
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onPeriodTypeChange("annual")}
                >
                  Anual
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ano
              </p>
              <Select value={String(year)} onValueChange={(value) => onYearChange(Number(value))}>
                <SelectTrigger className="h-11 w-full min-w-0 sm:w-[140px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((yearValue) => (
                    <SelectItem key={yearValue} value={String(yearValue)}>
                      {yearValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {periodType === "monthly" && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mes
                </p>
                <Select
                  value={String(month)}
                  onValueChange={(value) => onMonthChange(Number(value))}
                >
                  <SelectTrigger className="h-11 w-full min-w-0 sm:w-[180px]">
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onReset} className="h-11">
              Reset
            </Button>
            <Button onClick={onCreate} className="h-11">
              Nuevo presupuesto
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Periodo activo: <span className="font-medium text-foreground">{periodLabel}</span>
        </p>
      </div>
    </div>
  )
}
