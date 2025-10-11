import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// Number formatting
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Percentage formatting
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? "+" : ""}${formatNumber(value, decimals)}%`
}

// Date formatting
export function formatDate(date: Date | string, format: "short" | "medium" | "long" = "medium"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "medium":
    default:
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
  }
}

// Relative time formatting (e.g., "2 days ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Month formatting for budget views
export function formatMonth(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

// Get first day of month
export function getFirstDayOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Get last day of month
export function getLastDayOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// Calculate ROI
export function calculateROI(currentValue: number, costBasis: number): number {
  if (costBasis === 0) return 0
  return ((currentValue - costBasis) / costBasis) * 100
}

// Calculate profit/loss
export function calculateProfitLoss(currentValue: number, costBasis: number): number {
  return currentValue - costBasis
}

// Truncate text
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate a random color (for categories)
export function generateRandomColor(): string {
  const colors = [
    // Reds
    "#dc2626", // red-600
    "#ef4444", // red-500
    "#f87171", // red-400
    "#f43f5e", // rose-500
    "#fb7185", // rose-400
    
    // Oranges
    "#ea580c", // orange-600
    "#f97316", // orange-500
    "#fb923c", // orange-400
    
    // Ambers & Yellows
    "#d97706", // amber-600
    "#f59e0b", // amber-500
    "#fbbf24", // amber-400
    "#ca8a04", // yellow-600
    "#eab308", // yellow-500
    
    // Limes & Greens
    "#65a30d", // lime-600
    "#84cc16", // lime-500
    "#a3e635", // lime-400
    "#16a34a", // green-600
    "#22c55e", // green-500
    "#4ade80", // green-400
    
    // Emeralds & Teals
    "#059669", // emerald-600
    "#10b981", // emerald-500
    "#34d399", // emerald-400
    "#0d9488", // teal-600
    "#14b8a6", // teal-500
    "#2dd4bf", // teal-400
    
    // Cyans & Skys
    "#0891b2", // cyan-600
    "#06b6d4", // cyan-500
    "#22d3ee", // cyan-400
    "#0284c7", // sky-600
    "#0ea5e9", // sky-500
    "#38bdf8", // sky-400
    
    // Blues
    "#2563eb", // blue-600
    "#3b82f6", // blue-500
    "#60a5fa", // blue-400
    
    // Indigos & Violets
    "#4f46e5", // indigo-600
    "#6366f1", // indigo-500
    "#818cf8", // indigo-400
    "#7c3aed", // violet-600
    "#8b5cf6", // violet-500
    "#a78bfa", // violet-400
    
    // Purples & Fuchsias
    "#9333ea", // purple-600
    "#a855f7", // purple-500
    "#c084fc", // purple-400
    "#c026d3", // fuchsia-600
    "#d946ef", // fuchsia-500
    "#e879f9", // fuchsia-400
    
    // Pinks
    "#db2777", // pink-600
    "#ec4899", // pink-500
    "#f472b6", // pink-400
    
    // Browns & Stones
    "#92400e", // amber-800 (brown)
    "#78716c", // stone-500
    "#a8a29e", // stone-400
    
    // Slates & Grays
    "#475569", // slate-600
    "#64748b", // slate-500
    "#94a3b8", // slate-400
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Parse CSV safely
export function parseCSVAmount(value: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[$,\s]/g, "")
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

