"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

export function InsightsFiltersBar({
  year,
  month,
  onYearChange,
  onMonthChange,
  onReset,
  periodLabel,
  previousPeriodLabel,
}: {
  year: number
  month: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onReset: () => void
  periodLabel: string
  previousPeriodLabel: string
}) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index)

  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Year</p>
            <Select value={String(year)} onValueChange={(value) => onYearChange(Number(value))}>
              <SelectTrigger className="w-full sm:w-[130px]">
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
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Month</p>
            <Select value={String(month)} onValueChange={(value) => onMonthChange(Number(value))}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((monthOption) => (
                  <SelectItem key={monthOption.value} value={String(monthOption.value)}>
                    {monthOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
              Reset
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Periodo: <span className="font-medium text-foreground">{periodLabel}</span> (comparado con{" "}
          <span className="font-medium text-foreground">{previousPeriodLabel}</span>)
        </p>
      </div>
    </div>
  )
}
