"use client"

import { Loader2, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ChartContainer({
  title,
  description,
  comparisonLabel,
  loading,
  error,
  isEmpty,
  emptyMessage,
  onRetry,
  children,
}: {
  title: string
  description?: string
  comparisonLabel?: string
  loading: boolean
  error: string | null
  isEmpty: boolean
  emptyMessage: string
  onRetry?: () => void
  children: React.ReactNode
}) {
  const shouldRenderEmpty = isEmpty && !loading

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        {(description || comparisonLabel) && (
          <CardDescription className="space-y-1">
            {description && <span className="block">{description}</span>}
            {comparisonLabel && <span className="block text-xs uppercase tracking-wide">{comparisonLabel}</span>}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative space-y-3">
        {error && (
          <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <span>Failed to update this chart.</span>
            {onRetry && (
              <Button variant="ghost" size="sm" onClick={onRetry} className="h-8 gap-2">
                <RefreshCcw className="h-3.5 w-3.5" />
                Retry
              </Button>
            )}
          </div>
        )}

        {loading && isEmpty && (
          <div className="space-y-2">
            <div className="h-6 w-2/5 animate-pulse rounded bg-muted" />
            <div className="h-[250px] animate-pulse rounded-md bg-muted" />
          </div>
        )}

        {shouldRenderEmpty && (
          <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}

        {!isEmpty && <div>{children}</div>}

        {loading && !isEmpty && (
          <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-2 rounded-md bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
