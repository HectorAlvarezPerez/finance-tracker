"use client"

import { useSettings } from "@/lib/contexts/settings-context"
import { formatCurrency as formatCurrencyUtil } from "@/lib/utils"

export function useCurrency() {
  const settingsContext = useSettings()

  const currency = settingsContext?.settings?.default_currency || "EUR"
  const locale = settingsContext?.settings?.locale || "en-US"

  const formatCurrency = (amount: number): string => {
    return formatCurrencyUtil(amount, currency, locale)
  }

  return {
    currency,
    locale,
    formatCurrency,
  }
}
