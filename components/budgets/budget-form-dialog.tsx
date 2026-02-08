"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MONTH_OPTIONS,
  getBudgetKey,
  type BudgetFilters,
  type BudgetPeriodType,
  type BudgetWithCategory,
} from "@/lib/budgets/helpers"
import type { Database } from "@/types/database"

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]

type BudgetFormValues = {
  period_type: BudgetPeriodType
  year: number
  month: number | null
  category_id: string
  amount: number
}

export function BudgetFormDialog({
  open,
  onOpenChange,
  categories,
  defaults,
  editingBudget,
  existingBudgets,
  onSave,
  onDelete,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  categories: CategoryRow[]
  defaults: BudgetFilters
  editingBudget: BudgetWithCategory | null
  existingBudgets: BudgetWithCategory[]
  onSave: (values: BudgetFormValues, budgetId?: string) => Promise<void>
  onDelete: (budgetId: string) => Promise<void>
}) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 9 }, (_, index) => currentYear - 5 + index).reverse()

  const [periodType, setPeriodType] = useState<BudgetPeriodType>(defaults.periodType)
  const [year, setYear] = useState(defaults.year)
  const [month, setMonth] = useState(defaults.month)
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    if (editingBudget) {
      setPeriodType(editingBudget.period_type)
      setYear(editingBudget.year)
      setMonth(editingBudget.month ?? defaults.month)
      setCategoryId(editingBudget.category_id)
      setAmount(String(editingBudget.amount))
      setFormError(null)
      return
    }

    setPeriodType(defaults.periodType)
    setYear(defaults.year)
    setMonth(defaults.month)
    setCategoryId(categories[0]?.id ?? "")
    setAmount("")
    setFormError(null)
  }, [categories, defaults.month, defaults.periodType, defaults.year, editingBudget, open])

  const duplicateBudget = useMemo(() => {
    if (!categoryId) {
      return null
    }

    const monthValue = periodType === "monthly" ? month : null
    const key = getBudgetKey({
      period_type: periodType,
      year,
      month: monthValue,
      category_id: categoryId,
    })

    return (
      existingBudgets.find((budget) => {
        if (editingBudget && budget.id === editingBudget.id) {
          return false
        }

        const budgetKey = getBudgetKey({
          period_type: budget.period_type,
          year: budget.year,
          month: budget.month,
          category_id: budget.category_id,
        })

        return budgetKey === key
      }) ?? null
    )
  }, [categoryId, editingBudget, existingBudgets, month, periodType, year])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const parsedAmount = Number(amount)

    if (!categoryId) {
      setFormError("Selecciona una categoria para continuar.")
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("El importe debe ser mayor que 0.")
      return
    }

    if (periodType === "monthly" && (month < 1 || month > 12)) {
      setFormError("Selecciona un mes valido.")
      return
    }

    if (duplicateBudget && editingBudget) {
      setFormError("Ya existe un presupuesto con esa combinacion. Edita el existente.")
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      await onSave(
        {
          period_type: periodType,
          year,
          month: periodType === "monthly" ? month : null,
          category_id: categoryId,
          amount: parsedAmount,
        },
        editingBudget?.id
      )

      onOpenChange(false)
    } catch (error: any) {
      setFormError(error?.message ?? "No se pudo guardar el presupuesto.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingBudget) {
      return
    }

    setDeleting(true)
    setFormError(null)

    try {
      await onDelete(editingBudget.id)
      setDeleteConfirmOpen(false)
      onOpenChange(false)
    } catch (error: any) {
      setFormError(error?.message ?? "No se pudo borrar el presupuesto.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Editar presupuesto" : "Nuevo presupuesto"}</DialogTitle>
              <DialogDescription>
                Define limites de gasto por categoria para periodos mensuales o anuales.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget-period-type">Periodicidad</Label>
                <Select
                  value={periodType}
                  onValueChange={(value) => setPeriodType(value as BudgetPeriodType)}
                >
                  <SelectTrigger id="budget-period-type" className="h-11">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-year">Ano</Label>
                <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                  <SelectTrigger id="budget-year" className="h-11">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((yearOption) => (
                      <SelectItem key={yearOption} value={String(yearOption)}>
                        {yearOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {periodType === "monthly" && (
                <div className="space-y-2">
                  <Label htmlFor="budget-month">Mes</Label>
                  <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                    <SelectTrigger id="budget-month" className="h-11">
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

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="budget-category">Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="budget-category" className="h-11">
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="budget-amount">Importe presupuesto (EUR)</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  className="h-11"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>
            </div>

            {duplicateBudget && !editingBudget && (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Ya existe un presupuesto con la misma combinacion. Al guardar se actualizara el existente.
              </p>
            )}

            {formError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}

            <DialogFooter className="gap-2 sm:justify-between">
              <div>
                {editingBudget && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={saving || deleting}
                  >
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </Button>
                )}
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving || deleting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving || deleting}>
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar presupuesto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El presupuesto se eliminara permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
