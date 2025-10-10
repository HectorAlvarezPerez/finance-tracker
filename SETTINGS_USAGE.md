# Settings & Currency System

## How Settings Work

The app now supports user-specific currency and locale settings that persist in the database and apply throughout the application.

## Using Currency Formatting in Components

### For Client Components

Use the `useCurrency` hook to automatically format values with the user's preferred currency:

```tsx
"use client"

import { useCurrency } from "@/lib/hooks/use-currency"

export function MyComponent() {
  const { formatCurrency, currency, locale } = useCurrency()
  
  const amount = 1234.56
  
  return (
    <div>
      <p>{formatCurrency(amount)}</p>
      {/* Displays: $1,234.56 (if USD) or €1.234,56 (if EUR with es-ES locale) */}
    </div>
  )
}
```

### For Server Components

Pass the user's settings explicitly:

```tsx
import { formatCurrency } from "@/lib/utils"

export async function ServerComponent() {
  // Get user settings from Supabase
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", userId)
    .single()
    
  const currency = settings?.default_currency || "USD"
  const locale = settings?.locale || "en-US"
  
  return (
    <div>
      <p>{formatCurrency(1234.56, currency, locale)}</p>
    </div>
  )
}
```

## Available Settings

### Currencies
- USD 🇺🇸 - US Dollar
- EUR 🇪🇺 - Euro
- GBP 🇬🇧 - British Pound
- JPY 🇯🇵 - Japanese Yen
- CAD 🇨🇦 - Canadian Dollar
- AUD 🇦🇺 - Australian Dollar
- CHF 🇨🇭 - Swiss Franc
- CNY 🇨🇳 - Chinese Yuan
- MXN 🇲🇽 - Mexican Peso
- BRL 🇧🇷 - Brazilian Real
- ARS 🇦🇷 - Argentine Peso
- COP 🇨🇴 - Colombian Peso

### Locales
- en-US 🇺🇸 - English (US)
- en-GB 🇬🇧 - English (UK)
- es-ES 🇪🇸 - Español (España)
- es-MX 🇲🇽 - Español (México)
- es-AR 🇦🇷 - Español (Argentina)
- fr-FR 🇫🇷 - Français
- de-DE 🇩🇪 - Deutsch
- pt-BR 🇧🇷 - Português (Brasil)
- it-IT 🇮🇹 - Italiano

## How It Works

1. **SettingsProvider** wraps the dashboard layout
2. Settings are loaded once when the user logs in
3. The `useCurrency` hook provides access to user settings
4. When settings are updated, call `refreshSettings()` to reload them
5. The app uses `Intl.NumberFormat` for proper currency formatting

## Note

Currently, the UI labels are in English. Full i18n translation of the interface is not implemented yet - only currency and number formatting respects the locale setting.

