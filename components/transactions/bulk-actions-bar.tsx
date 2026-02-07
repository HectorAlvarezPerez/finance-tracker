"use client"

import { Button } from "@/components/ui/button"

export function BulkActionsBar({
  selectedCount,
  deleting,
  onDelete,
  onClearSelection,
}: {
  selectedCount: number
  deleting: boolean
  onDelete: () => void
  onClearSelection: () => void
}) {
  return (
    <div className="sticky top-[7.75rem] z-40 rounded-md border bg-background/95 px-3 py-2 backdrop-blur md:top-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {selectedCount} seleccionada{selectedCount === 1 ? "" : "s"}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Borrar"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            disabled={deleting}
          >
            Limpiar selección
          </Button>
        </div>
      </div>
    </div>
  )
}
