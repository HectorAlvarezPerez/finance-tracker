"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useBudgetProgress } from "@/lib/hooks/use-budget-progress"
import {
  formatPeriodLabel,
  getBudgetKey,
  getStatusClassName,
  getStatusLabel,
  type BudgetFilters,
  type BudgetPeriodType,
} from "@/lib/budgets/helpers"
import { BudgetsFiltersBar } from "@/components/budgets/budgets-filters-bar"
import { BudgetFormDialog } from "@/components/budgets/budget-form-dialog"
import { BudgetDetailPanel } from "@/components/budgets/budget-detail-panel"
import { formatCurrency } from "@/lib/utils"

function statusTrackColor(usagePct: number) {
  if (usagePct > 100) {
    return "bg-red-500"
  }
  if (usagePct >= 80) {
    return "bg-amber-500"
  }
  return "bg-emerald-500"
}

function ProgressTrack({ usagePct }: { usagePct: number }) {
  const width = Math.min(100, Math.max(0, usagePct))

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full ${statusTrackColor(usagePct)}`} style={{ width: `${width}%` }} />
    </div>
  )
}

function formatEur(value: number) {
  return formatCurrency(value, "EUR", "es-ES")
}

export function BudgetsDashboard({ userId }: { userId: string }) {
  const now = new Date()
  const defaultFilters: BudgetFilters = {
    periodType: "monthly",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }

  const supabase = createBrowserClient()
  const { toast } = useToast()

  const [filters, setFilters] = useState<BudgetFilters>(defaultFilters)
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const { data, loading, error, retry } = useBudgetProgress(userId, filters)

  const selectedProgress = useMemo(
    () => data?.progress.find((item) => item.budget.id === selectedBudgetId) ?? null,
    [data?.progress, selectedBudgetId]
  )

  const editingBudget = useMemo(
    () => data?.budgets.find((item) => item.id === editingBudgetId) ?? null,
    [data?.budgets, editingBudgetId]
  )

  useEffect(() => {
    if (!data?.progress.length) {
      setSelectedBudgetId(null)
      return
    }

    if (!selectedBudgetId) {
      setSelectedBudgetId(data.progress[0].budget.id)
      return
    }

    const stillExists = data.progress.some((item) => item.budget.id === selectedBudgetId)
    if (!stillExists) {
      setSelectedBudgetId(data.progress[0].budget.id)
    }
  }, [data?.progress, selectedBudgetId])

  const periodLabel = data?.periodLabel ?? formatPeriodLabel(filters)

  const handleReset = () => {
    setFilters(defaultFilters)
  }

  const openCreateDialog = () => {
    if (!data?.categories.length) {
      toast({
        title: "Categorias requeridas",
        description: "Necesitas al menos una categoria de gasto para crear presupuestos.",
        variant: "destructive",
      })
      return
    }

    setEditingBudgetId(null)
    setFormOpen(true)
  }

  const openEditDialog = (budgetId: string) => {
    setEditingBudgetId(budgetId)
    setFormOpen(true)
  }

  const handleSelectBudget = (budgetId: string) => {
    setSelectedBudgetId(budgetId)

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setMobileDetailOpen(true)
    }
  }

  const handleSaveBudget = async (
    values: {
      period_type: BudgetPeriodType
      year: number
      month: number | null
      category_id: string
      amount: number
    },
    budgetId?: string
  ) => {
    const payload = {
      period_type: values.period_type,
      year: values.year,
      month: values.period_type === "monthly" ? values.month : null,
      category_id: values.category_id,
      amount: values.amount,
      currency: "EUR",
    }

    const duplicate = (data?.budgets ?? []).find((budget) => {
      if (budgetId && budget.id === budgetId) {
        return false
      }

      return (
        getBudgetKey({
          period_type: budget.period_type,
          year: budget.year,
          month: budget.month,
          category_id: budget.category_id,
        }) ===
        getBudgetKey({
          period_type: payload.period_type,
          year: payload.year,
          month: payload.month,
          category_id: payload.category_id,
        })
      )
    })

    if (budgetId && duplicate) {
      throw new Error("Ya existe un presupuesto con esa combinacion.")
    }

    if (!budgetId && duplicate) {
      const { error: updateError } = await supabase
        .from("budgets")
        .update(payload)
        .eq("id", duplicate.id)
        .eq("user_id", userId)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Presupuesto actualizado",
        description: "Ya existia ese presupuesto y se actualizo automaticamente.",
      })

      setSelectedBudgetId(duplicate.id)
      retry()
      return
    }

    if (budgetId) {
      const { error: updateError } = await supabase
        .from("budgets")
        .update(payload)
        .eq("id", budgetId)
        .eq("user_id", userId)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Presupuesto actualizado",
        description: "Los cambios se guardaron correctamente.",
      })

      setSelectedBudgetId(budgetId)
      retry()
      return
    }

    const { data: inserted, error: insertError } = await supabase
      .from("budgets")
      .insert({
        user_id: userId,
        ...payload,
      })
      .select("id")
      .single()

    if (insertError) {
      if (insertError.code === "23505") {
        throw new Error("Ya existe un presupuesto con esa combinacion.")
      }
      throw insertError
    }

    toast({
      title: "Presupuesto creado",
      description: "Se creo un nuevo presupuesto correctamente.",
    })

    setSelectedBudgetId(inserted?.id ?? null)
    retry()
  }

  const handleDeleteBudget = async (budgetId: string) => {
    const { error: deleteError } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budgetId)
      .eq("user_id", userId)

    if (deleteError) {
      throw deleteError
    }

    toast({
      title: "Presupuesto eliminado",
      description: "El presupuesto se elimino correctamente.",
    })

    if (selectedBudgetId === budgetId) {
      setSelectedBudgetId(null)
      setMobileDetailOpen(false)
    }

    retry()
  }

  return (
    <div className="container mx-auto space-y-5 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-4 md:px-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Presupuestos</h1>
        <p className="text-muted-foreground">
          Gestiona presupuestos mensuales y anuales por categoria con progreso en tiempo real.
        </p>
      </div>

      <BudgetsFiltersBar
        periodType={filters.periodType}
        year={filters.year}
        month={filters.month}
        periodLabel={periodLabel}
        onPeriodTypeChange={(periodType) =>
          setFilters((previous) => ({
            ...previous,
            periodType,
          }))
        }
        onYearChange={(year) => setFilters((previous) => ({ ...previous, year }))}
        onMonthChange={(month) => setFilters((previous) => ({ ...previous, month }))}
        onReset={handleReset}
        onCreate={openCreateDialog}
      />

      {error && !data && (
        <Card className="border-destructive/40">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm text-destructive">No se pudieron cargar los presupuestos.</p>
            <Button variant="outline" onClick={retry} className="h-10">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total presupuestado</p>
            <p className="mt-1 text-xl font-semibold">{formatEur(data?.totals.budgeted ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total gastado</p>
            <p className="mt-1 text-xl font-semibold text-red-600">{formatEur(data?.totals.spent ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Disponible</p>
            <p
              className={`mt-1 text-xl font-semibold ${(data?.totals.remaining ?? 0) < 0 ? "text-red-600" : "text-emerald-600"}`}
            >
              {formatEur(data?.totals.remaining ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {error && data && (
            <Card className="border-destructive/40">
              <CardContent className="flex flex-wrap items-center justify-between gap-2 p-3">
                <p className="text-sm text-destructive">Error actualizando datos. Mostrando ultimo estado valido.</p>
                <Button variant="outline" size="sm" onClick={retry}>
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          )}

          {loading && !data && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={`budget-skeleton-${index}`}>
                  <CardContent className="space-y-3 p-4">
                    <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && data && data.progress.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="space-y-3 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay presupuestos para este periodo. Crea uno para empezar a medir tu progreso.
                </p>
                <div>
                  <Button onClick={openCreateDialog}>Nuevo presupuesto</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {data && data.progress.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {data.progress.map((item) => (
                <div
                  key={item.budget.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectBudget(item.budget.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleSelectBudget(item.budget.id)
                    }
                  }}
                  className={`rounded-xl border bg-card p-4 text-left transition hover:border-primary/60 hover:shadow-sm ${
                    selectedBudgetId === item.budget.id ? "border-primary/60 shadow-sm" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">
                        {item.budget.categories?.name ?? "Sin categoria"}
                      </p>
                      <p className="text-xs text-muted-foreground">{periodLabel}</p>
                    </div>
                    <Badge className={getStatusClassName(item.status)}>{getStatusLabel(item.status)}</Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Presupuesto</p>
                      <p className="font-semibold">{formatEur(Number(item.budget.amount))}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Gastado</p>
                      <p className="font-semibold text-red-600">{formatEur(item.spent)}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Uso</span>
                      <span>{item.usagePct.toFixed(1)}%</span>
                    </div>
                    <ProgressTrack usagePct={item.usagePct} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${item.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {item.remaining < 0 ? "Excedido" : "Disponible"}: {formatEur(item.remaining)}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={(event) => {
                        event.stopPropagation()
                        openEditDialog(item.budget.id)
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-4 shadow-sm">
            {selectedProgress ? (
              <BudgetDetailPanel
                item={selectedProgress}
                periodLabel={periodLabel}
                onEdit={() => openEditDialog(selectedProgress.budget.id)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Selecciona un presupuesto para ver su detalle sin salir de esta pantalla.
              </p>
            )}
          </div>
        </aside>
      </div>

      <Dialog
        open={mobileDetailOpen && !!selectedProgress}
        onOpenChange={(open) => setMobileDetailOpen(open)}
      >
        <DialogContent className="bottom-0 left-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-t-2xl border-x-0 border-b-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-lg lg:hidden">
          {selectedProgress && (
            <>
              <DialogHeader>
                <DialogTitle>Detalle de presupuesto</DialogTitle>
                <DialogDescription>
                  Informacion detallada para {selectedProgress.budget.categories?.name ?? "la categoria"}.
                </DialogDescription>
              </DialogHeader>
              <BudgetDetailPanel
                item={selectedProgress}
                periodLabel={periodLabel}
                onEdit={() => {
                  setMobileDetailOpen(false)
                  openEditDialog(selectedProgress.budget.id)
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <BudgetFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingBudgetId(null)
          }
        }}
        categories={data?.categories ?? []}
        defaults={filters}
        editingBudget={editingBudget}
        existingBudgets={data?.budgets ?? []}
        onSave={handleSaveBudget}
        onDelete={handleDeleteBudget}
      />
    </div>
  )
}
