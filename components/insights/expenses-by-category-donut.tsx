"use client"

import { useMemo, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useExpensesByCategory } from "@/lib/hooks/use-expenses-by-category"

const MONTH_OPTIONS = [
  { value: "all", label: "All year" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

type TooltipEntry = {
  name: string
  value: number
  payload: {
    percentage: number
  }
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipEntry[]
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const item = payload[0]

  return (
    <div className="rounded-md border bg-background p-2 shadow">
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatCurrency(item.value, "EUR", "es-ES")} ({item.payload.percentage.toFixed(1)}%)
      </p>
    </div>
  )
}

export function ExpensesByCategoryDonut({ userId }: { userId: string }) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const [year, setYear] = useState<number>(currentYear)
  const [month, setMonth] = useState<number | null>(now.getMonth() + 1)

  const years = useMemo(
    () => Array.from({ length: 10 }, (_, index) => currentYear - index),
    [currentYear]
  )

  const { data, total, loading, error } = useExpensesByCategory({
    userId,
    year,
    month,
  })

  const hasData = data.length > 0 && total > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Expenses by Category (Donut)</CardTitle>
            <CardDescription>Distribution of expenses for the selected period</CardDescription>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Select
              value={String(year)}
              onValueChange={(value) => setYear(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={String(yearOption)}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month === null ? "all" : String(month)}
              onValueChange={(value) => setMonth(value === "all" ? null : Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((monthOption) => (
                  <SelectItem key={monthOption.value} value={monthOption.value}>
                    {monthOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Error loading chart. Showing latest available data.
          </div>
        )}

        {loading && (
          <div className="mb-4 flex h-[320px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Loading chart...
          </div>
        )}

        {!loading && !hasData && (
          <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No hay gastos en este periodo
          </div>
        )}

        {hasData && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
              {data.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 rounded-md border p-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="truncate text-sm font-medium">{item.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.total, "EUR", "es-ES")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
