"use client"

import { useCallback, useMemo, useState } from "react"

export function useRowSelection(initialSelectedIds?: Iterable<string>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialSelectedIds ?? [])
  )

  const selectedCount = selectedIds.size

  const hasSelection = selectedCount > 0

  const selectedIdsArray = useMemo(() => Array.from(selectedIds), [selectedIds])

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleAllVisible = useCallback((visibleIds: string[]) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      const allVisibleSelected = visibleIds.every((id) => next.has(id))

      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id))
      } else {
        visibleIds.forEach((id) => next.add(id))
      }

      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const replaceSelection = useCallback((nextSelection: Iterable<string>) => {
    setSelectedIds(new Set(nextSelection))
  }, [])

  return {
    selectedIds,
    selectedIdsArray,
    selectedCount,
    hasSelection,
    isSelected,
    toggleRow,
    toggleAllVisible,
    clearSelection,
    replaceSelection,
  }
}
