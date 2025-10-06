# Quick Start Guide

Get your Finance Tracker up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free)

## Setup Steps

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Create Supabase Project (2 mins)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Choose a name, password, and region
4. Wait for database to provision

### 3. Set Up Database (2 mins)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste into the editor and click **Run**
4. Verify tables appear in **Table Editor**

### 4. Configure Environment (1 min)

1. In Supabase, go to **Settings > API**
2. Copy your **Project URL** and **anon key**
3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Your Account (1 min)

1. Click **Sign up**
2. Enter your email and password
3. Check email for verification (if required)
4. Sign in

### 7. Seed Default Data (1 min)

```bash
npm run db:seed
```

This creates:
- Default income/expense categories
- A checking account
- Initial settings

### 8. Start Using! (1 min)

You're ready! Try:

1. **Add an account**: Go to Accounts → Add Account
2. **Add a transaction**: Go to Transactions → Add Transaction
3. **Set a budget**: Go to Budgets → Add Budget
4. **Add investments**: Go to Portfolio → Add Holding

## Sample Workflow

### Add Your First Transaction

1. Go to **Transactions**
2. Click **Add Transaction**
3. Fill in:
   - Date: Today
   - Description: "Grocery shopping"
   - Amount: -85.50 (negative for expenses)
   - Account: Main Checking
   - Category: Groceries
4. Click **Add Transaction**

### Import CSV (Bulk Upload)

1. Go to **Transactions**
2. Click **Import CSV**
3. Upload a CSV file with format:
   ```csv
   date,description,amount,notes
   2024-01-15,Salary,3000.00,Monthly salary
   2024-01-20,Rent,-1500.00,January rent
   ```
4. Transactions appear immediately

### Set Your First Budget

1. Go to **Budgets**
2. Click **Add Budget**
3. Select category (e.g., Groceries)
4. Set amount (e.g., $500)
5. Track progress automatically

### Track Investments

1. Go to **Portfolio**
2. Click **Add Holding**
3. Enter:
   - Symbol: SPY
   - Type: Index Fund
   - Quantity: 10
   - Cost Basis: 4500
4. Click **Update Prices** to add current price
5. See P/L and ROI calculated automatically

## Tips

- **Dark Mode**: Click the sun/moon icon in the top right
- **Mobile**: Works great on phones! Use bottom navigation
- **CSV Format**: Expenses should be negative amounts
- **Categories**: Edit or add more in the transactions page
- **Dashboard**: Shows overview of all your finances

## Common Issues

### Can't Sign In?
- Check email for verification link
- Verify Supabase Auth is enabled
- Check environment variables are correct

### No Data Showing?
- Make sure you ran `npm run db:seed`
- Verify you're signed in
- Check browser console for errors

### Import Not Working?
- Verify CSV format matches exactly
- Ensure dates are YYYY-MM-DD format
- Check amounts are numbers (not currency formatted)

## What's Next?

- Explore the **Insights** page for spending analysis
- Set up **Recurring Transactions** for automated entries
- Add **Transaction Rules** for auto-categorization
- Check out the **Settings** page for customization

## Need Help?

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Open an issue on GitHub

---

**Happy tracking! 🎉**

