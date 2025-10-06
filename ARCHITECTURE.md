# Architecture Documentation

Comprehensive technical overview of the Finance Tracker application.

## System Architecture

### High-Level Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │ ───> │   Vercel     │ ───> │  Supabase   │
│  (Next.js)  │ <─── │  (Edge + API)│ <─── │  (Postgres) │
└─────────────┘      └──────────────┘      └─────────────┘
      │                      │                      │
      │                      │                      │
   Client                 Server               Database
   - React              - API Routes          - Auth
   - UI State           - Server Actions      - Storage
   - Local Cache        - Middleware           - RLS
```

## Frontend Architecture

### Next.js App Router Structure

```
app/
├── (auth)/                 # Auth route group (no nav)
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── (dashboard)/           # Dashboard route group (with nav)
│   ├── layout.tsx        # Dashboard layout with nav
│   ├── dashboard/        # Overview dashboard
│   ├── transactions/     # Transaction management
│   ├── accounts/         # Account management
│   ├── budgets/          # Budget tracking
│   ├── insights/         # Spending analysis
│   ├── portfolio/        # Investment tracking
│   └── settings/         # User settings
├── globals.css           # Global styles + Tailwind
└── layout.tsx           # Root layout (theme, fonts)
```

### Component Architecture

**Atomic Design Pattern**:

1. **UI Components** (`components/ui/`):
   - Base shadcn/ui components
   - Reusable across entire app
   - No business logic

2. **Feature Components** (`components/{feature}/`):
   - Feature-specific components
   - Contains business logic
   - Composed of UI components

3. **Page Components** (`app/(dashboard)/{page}/`):
   - Server components by default
   - Fetch data
   - Compose feature components

### State Management

**Server State**: 
- Managed by Supabase
- Fetched in Server Components
- Automatically revalidated

**Client State**:
- React useState for local UI state
- No global state management needed (yet)
- Forms handled by controlled components

**Cache Strategy**:
- Next.js automatic caching
- Revalidation via `router.refresh()`
- No manual cache management

## Backend Architecture

### Database Schema

**Core Tables**:

```sql
users (Supabase Auth)
  └─> settings (1:1)
  └─> accounts (1:many)
      └─> transactions (1:many)
  └─> categories (1:many)
      └─> budgets (1:many)
  └─> holdings (1:many)
      └─> trades (1:many)
  └─> transaction_rules (1:many)
  └─> recurring_transactions (1:many)
  └─> prices (1:many)
```

**Relationships**:
- Each user owns multiple accounts, categories, transactions, etc.
- Transactions reference accounts and categories
- Budgets reference categories
- Holdings can reference trades

### Row Level Security (RLS)

**Policy Pattern**:

```sql
-- Example for transactions table
CREATE POLICY "users_read_own_transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);
```

**Applied to all tables** - ensures data isolation at DB level.

### API Architecture

**Server Components** (preferred):
```typescript
// Direct database access
const supabase = createServerClient()
const { data } = await supabase.from('transactions').select('*')
```

**API Routes** (when needed):
```typescript
// app/api/example/route.ts
export async function GET(req: NextRequest) {
  const supabase = createServerClient()
  // ... logic
  return NextResponse.json(data)
}
```

**Server Actions** (for mutations):
```typescript
'use server'
async function addTransaction(data: TransactionData) {
  const supabase = createServerClient()
  await supabase.from('transactions').insert(data)
  revalidatePath('/transactions')
}
```

## Service Layer

### Price Service

**Interface**:
```typescript
interface IPriceService {
  getPrice(symbol: string, userId?: string): Promise<PriceData | null>
  setPrice(symbol: string, price: number, userId: string): Promise<void>
  getHistoricalPrices(...): Promise<PriceData[]>
}
```

**Implementations**:
- `ManualPriceService`: Database-backed manual prices (default)
- `APIPriceService`: External API integration (future, feature-flagged)

**Factory Pattern**:
```typescript
export function createPriceService(client): IPriceService {
  if (FEATURE_FLAG_REALTIME_PRICES) {
    return new APIPriceService(client)
  }
  return new ManualPriceService(client)
}
```

### Rules Engine

**Pattern Matching**:
```typescript
class RulesEngine {
  applyRules(transaction: Transaction): RuleMatch | null {
    for (const rule of this.rules) {
      if (this.matchesPattern(transaction.description, rule.pattern)) {
        return { categoryId: rule.categoryId, ... }
      }
    }
    return null
  }
}
```

**Supports**:
- Simple text matching (case-insensitive)
- Regex patterns
- Merchant/payee extraction

### Budget Calculator

**Key Functions**:

1. **calculateProgress**: Compare spending to budget
2. **generateInsights**: Identify overspending patterns
3. **compareToHistory**: Historical trend analysis
4. **recommendBudget**: ML-free budget suggestions

## Authentication Flow

```
1. User visits protected route
   ↓
2. Middleware checks session
   ↓
   No session? → Redirect to /login
   ↓
3. User logs in via Supabase Auth
   ↓
4. Session cookie set
   ↓
5. Middleware allows access
   ↓
6. Page fetches user-specific data (RLS enforced)
```

**Implementation**:
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}
```

## Data Flow Examples

### Adding a Transaction

```
1. User fills form (client)
   ↓
2. Form submission → Server Action
   ↓
3. Validation (Zod schema)
   ↓
4. Insert to Supabase
   ↓
5. RLS policy checks user_id
   ↓
6. Transaction inserted
   ↓
7. revalidatePath('/transactions')
   ↓
8. UI updates with new data
```

### CSV Import

```
1. User uploads CSV file
   ↓
2. Papa Parse processes CSV
   ↓
3. Map CSV rows to transaction objects
   ↓
4. Batch insert to Supabase
   ↓
5. Duplicate detection (optional)
   ↓
6. Apply transaction rules
   ↓
7. Auto-categorize matched transactions
   ↓
8. Refresh page data
```

### Budget Progress Calculation

```
1. Page loads → Server Component
   ↓
2. Fetch budgets for current month
   ↓
3. Fetch transactions for current month
   ↓
4. Group transactions by category
   ↓
5. Calculate spent per category
   ↓
6. Compare to budget limits
   ↓
7. Determine status (under/near/over)
   ↓
8. Render progress bars
```

## Security Architecture

### Multi-Layer Security

1. **Database Layer** (RLS):
   - Enforces user_id checks on all queries
   - Cannot be bypassed

2. **API Layer** (Middleware):
   - Validates session tokens
   - Redirects unauthenticated users

3. **Application Layer** (Validation):
   - Zod schemas validate input
   - Type-safe throughout

4. **Network Layer** (HTTPS):
   - All traffic encrypted
   - Secure cookies only

### Attack Prevention

**SQL Injection**: 
- Supabase uses parameterized queries
- No raw SQL from user input

**XSS**:
- React escapes by default
- No dangerouslySetInnerHTML used

**CSRF**:
- SameSite cookies
- Origin validation

**Auth Bypass**:
- RLS enforced at DB level
- Session verified on every request

## Performance Optimization

### Database

**Indexes**:
```sql
CREATE INDEX idx_transactions_user_date 
  ON transactions(user_id, date DESC);
  
CREATE INDEX idx_transactions_category 
  ON transactions(category_id);
```

**Query Optimization**:
- Limit result sets (pagination)
- Select only needed columns
- Use `single()` for unique queries

### Frontend

**Code Splitting**:
- Automatic with Next.js App Router
- Dynamic imports for heavy components

**Image Optimization**:
- Next.js Image component
- Automatic WebP conversion
- Lazy loading

**Caching**:
- Static page generation where possible
- Server component caching
- Browser cache headers

## Scalability Considerations

### Current Architecture (Free Tier)

- **Database**: 500 MB, ~1000 concurrent connections
- **API**: 100 GB bandwidth, unlimited serverless invocations
- **Suitable for**: Up to 1000 active users

### Scaling Strategy

**Phase 1: Optimize Queries** (1000-5000 users)
- Add more indexes
- Implement pagination
- Cache expensive queries

**Phase 2: Database Upgrade** (5000-10000 users)
- Upgrade to Supabase Pro
- Enable connection pooling
- Add read replicas

**Phase 3: Edge Distribution** (10000+ users)
- Vercel Edge Functions
- CDN for static assets
- Geographic database distribution

## Monitoring & Observability

### Built-in Tools

**Vercel**:
- Real-time logs
- Performance metrics
- Error tracking

**Supabase**:
- Database metrics
- Auth logs
- API usage stats

### Custom Logging

```typescript
// lib/logger.ts
export function logError(error: Error, context: any) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context,
  })
}
```

## Testing Strategy

### Unit Tests

**Focus Areas**:
- Utility functions (formatCurrency, calculateROI)
- Business logic (RulesEngine, BudgetCalculator)
- Type validation (Zod schemas)

**Example**:
```typescript
describe('calculateROI', () => {
  it('calculates positive ROI correctly', () => {
    expect(calculateROI(1100, 1000)).toBe(10)
  })
})
```

### Integration Tests

**API Routes**:
```typescript
describe('POST /api/transactions', () => {
  it('creates transaction with valid data', async () => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(validTransaction),
    })
    expect(response.status).toBe(201)
  })
})
```

### E2E Tests (Future)

Use Playwright for critical flows:
- User signup/login
- Add transaction
- Create budget
- CSV import

## Deployment Pipeline

```
1. Push to GitHub
   ↓
2. Vercel detects push
   ↓
3. Install dependencies
   ↓
4. Type check (tsc)
   ↓
5. Build Next.js app
   ↓
6. Run tests (if configured)
   ↓
7. Deploy to preview URL
   ↓
8. Merge to main → Deploy to production
   ↓
9. Automatic rollback on error
```

## Future Architecture Improvements

1. **Caching Layer**: Redis for expensive queries
2. **Background Jobs**: Queue system for recurring transactions
3. **Real-time Updates**: Supabase Realtime subscriptions
4. **Mobile App**: Share codebase with React Native
5. **Analytics**: Event tracking and user behavior
6. **AI Features**: Spending predictions, anomaly detection

---

**Last Updated**: 2024-01-20

