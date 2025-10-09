# Finance Tracker

A comprehensive, production-ready personal finance web application built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. Track your income, expenses, budgets, and investments all in one place.

![Finance Tracker](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### Core Functionality
- **🤖 AI Assistant**: Natural language commands to create categories, transactions, accounts, and budgets (powered by OpenAI GPT-4)
- **Multi-Account Management**: Track checking, savings, brokerage, crypto, and other accounts
- **Transaction Management**: Full CRUD operations with CSV import/export
- **Smart Categorization**: Auto-categorize transactions with customizable rules
- **Recurring Transactions**: Fully automated transaction scheduling (daily, weekly, monthly, yearly) with Vercel Cron Jobs
- **Budget Tracking**: Set monthly budgets with progress tracking and alerts
- **Spending Insights**: AI-powered analysis and recommendations
- **Investment Portfolio**: Track stocks, index funds, crypto, and precious metals with P/L and ROI calculations
- **Multi-Currency Support**: Handle multiple currencies with proper formatting

### Technical Features
- **Authentication**: Secure email/password auth with Supabase
- **Row Level Security**: Multi-tenant architecture with RLS policies
- **Real-time Updates**: Instant UI updates on data changes
- **Dark Mode**: System-aware light/dark theme toggle
- **Responsive Design**: Mobile-first, works great on all devices
- **CSV Import/Export**: Bulk transaction management
- **Price Management**: Manual price entry with API abstraction for future real-time prices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript 5**
- **Tailwind CSS 3**
- **shadcn/ui** (Radix UI components)
- **Recharts** (data visualization)
- **next-themes** (dark mode)

### Backend & Database
- **Supabase** (PostgreSQL, Auth, Row Level Security)
- **OpenAI GPT-4** (AI Assistant with function calling)
- **Zod** (schema validation)

### Deployment
- **Vercel** (hosting & serverless functions)
- **GitHub** (version control & CI/CD)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account ([supabase.com](https://supabase.com))
- OpenAI API key (optional, for AI Assistant) ([platform.openai.com](https://platform.openai.com))
- Vercel account (optional, for deployment)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Finance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings > API**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration (optional - for AI Assistant)
OPENAI_API_KEY=sk-your-openai-api-key

# Cron Job Configuration (optional - for automatic recurring transactions)
CRON_SECRET=your-secure-random-token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_REALTIME_PRICES=false
NEXT_PUBLIC_ENABLE_BANK_INTEGRATION=false
```

> **📚 AI Assistant Setup**: For detailed instructions on setting up and using the AI Assistant, see [AI_ASSISTANT.md](./AI_ASSISTANT.md)
> 
> **🔄 Recurring Transactions**: For automatic execution of recurring transactions with Vercel Cron Jobs, see [RECURRING_TRANSACTIONS.md](./RECURRING_TRANSACTIONS.md)

### 5. Run Database Migrations

The schema is already in `supabase/schema.sql`. Run it in your Supabase SQL Editor.

### 6. Seed Default Data

After creating your first user account, run:

```bash
npm run db:seed
```

This creates default categories, a checking account, and initial settings.

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Finance/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Main app pages
│   │   ├── dashboard/       # Overview
│   │   ├── transactions/    # Transaction management
│   │   ├── accounts/        # Account management
│   │   ├── budgets/         # Budget tracking
│   │   ├── insights/        # Spending analysis
│   │   ├── portfolio/       # Investment tracking
│   │   └── settings/        # User preferences
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific components
│   ├── transactions/        # Transaction components
│   ├── accounts/            # Account components
│   ├── budgets/             # Budget components
│   ├── insights/            # Insights components
│   ├── portfolio/           # Portfolio components
│   └── settings/            # Settings components
├── lib/                     # Utilities and services
│   ├── supabase/           # Supabase client configuration
│   ├── services/           # Business logic services
│   │   ├── price-service.ts
│   │   ├── rules-engine.ts
│   │   └── budget-calculator.ts
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript type definitions
│   └── database.ts         # Supabase database types
├── supabase/               # Database schema and migrations
│   └── schema.sql
├── scripts/                # Utility scripts
│   └── seed.ts            # Database seeding
└── public/                # Static assets
```

## 🎯 Core Concepts

### Database Schema

The app uses 10 main tables:

- **accounts**: Bank accounts, savings, brokerage, etc.
- **categories**: Income/expense categories with colors and icons
- **transactions**: All financial transactions
- **transaction_rules**: Auto-categorization rules
- **recurring_transactions**: Automated recurring entries
- **budgets**: Monthly spending limits
- **holdings**: Investment portfolio assets
- **prices**: Asset price history (manual/API)
- **trades**: Investment transaction history
- **settings**: User preferences

### Row Level Security (RLS)

Every table has RLS policies ensuring users can only access their own data. Example:

```sql
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
```

### Price Service Architecture

The `PriceService` interface allows seamless switching between manual price entry and API-based pricing:

```typescript
export interface IPriceService {
  getPrice(symbol: string, userId?: string): Promise<PriceData | null>
  setPrice(symbol: string, price: number, userId: string): Promise<void>
}
```

Currently uses `ManualPriceService`. Enable `APIPriceService` via feature flag when ready.

## 🧪 Example User Flow

1. **Sign Up**: Create account at `/signup`
2. **Add Account**: Create a checking account
3. **Add Categories**: Default categories are seeded automatically
4. **Import Transactions**: Upload CSV or add manually
5. **Set Budget**: Create monthly budgets for categories
6. **View Dashboard**: See overview of finances
7. **Track Portfolio**: Add investment holdings and update prices
8. **Get Insights**: Analyze spending patterns

## 📊 Sample CSV Format for Import

```csv
date,description,amount,notes
2024-01-15,Grocery Store,-85.50,Weekly groceries
2024-01-20,Salary Deposit,3000.00,Monthly salary
2024-01-22,Electric Bill,-120.00,January bill
```

- **amount**: Positive for income, negative for expenses
- **date**: YYYY-MM-DD format
- **notes**: Optional

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

Vercel automatically:
- Builds the Next.js app
- Sets up preview deployments for PRs
- Provides a production URL

### Environment Variables for Production

Add these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your vercel URL)

## 🔒 Security

- **Authentication**: Managed by Supabase Auth
- **RLS Policies**: Enforce data isolation at database level
- **Environment Variables**: Secrets never committed to repo
- **API Routes**: Protected with auth middleware
- **Input Validation**: Zod schemas on all forms

## 🎨 Customization

### Adding New Categories

1. Go to Settings or run a SQL insert:
```sql
INSERT INTO categories (user_id, name, type, color, icon)
VALUES ('your-user-id', 'My Category', 'expense', '#ef4444', 'tag');
```

### Changing Theme Colors

Edit `tailwind.config.ts` and `app/globals.css` to customize colors.

### Adding Transaction Rules

Go to Transactions page → Manage Rules. Rules support:
- Simple text matching
- Regex patterns
- Auto-categorization
- Auto-renaming

## 📈 Future Enhancements (Roadmap)

- [ ] Real-time price API integration (feature-flagged)
- [ ] Bank integration (Plaid/TrueLayer)
- [ ] Bill reminders and notifications
- [ ] Multi-user households
- [ ] Export to PDF reports
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and forecasting
- [ ] Goal tracking (savings goals)
- [ ] Tax reporting features

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: your-email@example.com

## 🎉 Getting Help

- **Documentation**: This README and inline code comments
- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ for better financial management**

