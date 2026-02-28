"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { chartTokens } from "@/lib/theme/chartTokens"
import { cn } from "@/lib/utils"

type TooltipRow = {
  id: string
  label: string
  value: string
  color?: string
}

type TooltipFooter = {
  label: string
  value: string
}

type CompactLegendItem = {
  key: string
  label: string
  color: string
  value?: string
}

const currencySymbolByCode: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
}

export function formatCurrencyTick(value: number, currency: string) {
  if (value === 0) {
    return "0"
  }

  const symbol = currencySymbolByCode[currency] ?? currency
  const absValue = Math.abs(value)
  if (absValue >= 1000) {
    return `${symbol}${(value / 1000).toFixed(0)}k`
  }

  return `${symbol}${value.toFixed(0)}`
}

export function TooltipCard({
  title,
  rows,
  footer,
  moreLabel,
}: {
  title: string
  rows: TooltipRow[]
  footer?: TooltipFooter
  moreLabel?: string
}) {
  return (
    <div
      className="min-w-[210px] space-y-2 rounded-md border p-2.5 shadow-sm"
      style={{
        backgroundColor: chartTokens.neutrals.surface,
        borderColor: chartTokens.neutrals.border,
      }}
    >
      <p className="text-sm font-semibold">{title}</p>

      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-3 text-xs">
            <span className="min-w-0 truncate text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                {row.color && (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{row.label}</span>
              </span>
            </span>
            <span className="shrink-0 font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      {moreLabel && <p className="text-[11px] text-muted-foreground">{moreLabel}</p>}

      {footer && (
        <div className="flex items-center justify-between border-t pt-1.5 text-xs">
          <span className="text-muted-foreground">{footer.label}</span>
          <span className="font-semibold text-foreground">{footer.value}</span>
        </div>
      )}
    </div>
  )
}

export function CompactLegend({
  items,
  maxVisible = 6,
  className,
}: {
  items: CompactLegendItem[]
  maxVisible?: number
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasOverflow = items.length > maxVisible

  const visibleItems = useMemo(() => {
    if (expanded || !hasOverflow) {
      return items
    }
    return items.slice(0, maxVisible)
  }, [expanded, hasOverflow, items, maxVisible])

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("space-y-1", expanded ? "max-h-[180px] overflow-auto pr-1" : undefined)}>
        {visibleItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-2 text-xs sm:text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </span>
            {item.value && <span className="shrink-0 font-semibold">{item.value}</span>}
          </div>
        ))}
      </div>

      {hasOverflow && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : `Show ${items.length - maxVisible} more`}
        </Button>
      )}
    </div>
  )
}
