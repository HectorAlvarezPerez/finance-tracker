# Quick I18n Update Instructions

## For remaining pages, apply this pattern:

### 1. Add import at top:
```typescript
import { getTranslations } from 'next-intl/server'  // for server components
// or
import { useTranslations } from 'next-intl'  // for client components
```

### 2. Inside component, add:
```typescript
const t = await getTranslations('pagename')  // server
// or
const t = useTranslations('pagename')  // client
```

### 3. Replace hardcoded strings:
```typescript
// Before:
<h1>Title</h1>

// After:
<h1>{t('title')}</h1>
```

## Pages still needing title/subtitle updates:
- ✅ Dashboard
- ✅ Settings
- ✅ Transactions
- ✅ Accounts
- ⏳ Budgets (lines 50-52)
- ⏳ Insights (lines 68-72)
- ⏳ Portfolio (lines 50-52)
- ⏳ Categories (lines 28-30)
- ⏳ Recurring (lines 53-55)

## Auth pages:
- ⏳ Login
- ⏳ Signup

Translation keys are defined in `/messages/en.json` and `/messages/es.json`

