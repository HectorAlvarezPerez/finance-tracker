"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CreditCard,
  Wallet,

  TrendingUp,
  Settings,
  LineChart,
  Tag,

} from "lucide-react"
import { ThemeToggle } from "../theme/theme-toggle"
import { LogoutButton } from "./logout-button"

export function Nav() {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navItems = [
    {
      title: t('dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('transactions'),
      href: "/transactions",
      icon: CreditCard,
    },

    {
      title: t('accounts'),
      href: "/accounts",
      icon: Wallet,
    },
    {
      title: t('categories'),
      href: "/categories",
      icon: Tag,
    },

    {
      title: t('insights'),
      href: "/insights",
      icon: LineChart,
    },
    {
      title: t('portfolio'),
      href: "/portfolio",
      icon: TrendingUp,
    },

  ]

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
        <LogoutButton />
        <ThemeToggle />
        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
          title={t('settings')}
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navItems = [
    {
      title: t('dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('transactions'),
      href: "/transactions",
      icon: CreditCard,
    },

    {
      title: t('accounts'),
      href: "/accounts",
      icon: Wallet,
    },
    {
      title: t('categories'),
      href: "/categories",
      icon: Tag,
    },

    {
      title: t('insights'),
      href: "/insights",
      icon: LineChart,
    },
    {
      title: t('portfolio'),
      href: "/portfolio",
      icon: TrendingUp,
    },

  ]

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

