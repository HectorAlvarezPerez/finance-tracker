"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  Settings,
  LineChart,
  Tag,
  Repeat
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Recurring",
    href: "/recurring",
    icon: Repeat,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Wallet,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Tag,
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: PiggyBank,
  },
  {
    title: "Insights",
    href: "/insights",
    icon: LineChart,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Finance Tracker</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </nav>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 py-2 px-4 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors min-w-[70px] flex-shrink-0",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

