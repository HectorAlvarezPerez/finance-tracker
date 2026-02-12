-- Finance Tracker Database Schema
-- Supabase PostgreSQL Schema with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Settings table for user preferences
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  default_currency TEXT NOT NULL DEFAULT 'EUR',
  locale TEXT NOT NULL DEFAULT 'en-US',
  theme TEXT NOT NULL DEFAULT 'system',
  insights_opt_in BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Accounts table for bank accounts, savings, brokerage, etc.
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'brokerage', 'crypto', 'other')),
  currency TEXT NOT NULL DEFAULT 'EUR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for organizing transactions
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'investment')),
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'tag',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Transactions for all money movements
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'pending')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction rules for auto-categorization
CREATE TABLE IF NOT EXISTS transaction_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern TEXT NOT NULL,
  default_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  default_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  action TEXT NOT NULL DEFAULT 'categorize' CHECK (action IN ('categorize', 'rename')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring transactions for automated monthly/weekly items
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  interval_value INTEGER NOT NULL DEFAULT 1,
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  next_run_at TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets for category spending limits (monthly and annual)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('monthly', 'annual')),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 9999),
  month INTEGER CHECK (month >= 1 AND month <= 12),
  currency TEXT NOT NULL DEFAULT 'EUR',
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (period_type = 'monthly' AND month IS NOT NULL)
    OR (period_type = 'annual' AND month IS NULL)
  )
);

-- Holdings for investment portfolio
CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_name TEXT NOT NULL,
  asset_symbol TEXT,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('index_fund', 'bond_fund', 'crypto', 'stock', 'gold', 'etf')),
  quantity DECIMAL(20, 8) NOT NULL,
  weekly_quantity DECIMAL(20, 8) NOT NULL DEFAULT 0 CHECK (weekly_quantity >= 0),
  monthly_quantity DECIMAL(20, 8) NOT NULL DEFAULT 0 CHECK (monthly_quantity >= 0),
  average_buy_price DECIMAL(15, 4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices for investment valuation
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_symbol TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'api')),
  price DECIMAL(15, 4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  as_of TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades for investment transactions (optional, for detailed tracking)
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_symbol TEXT NOT NULL,
  date DATE NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity DECIMAL(20, 8) NOT NULL,
  price DECIMAL(15, 4) NOT NULL,
  fees DECIMAL(15, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  holding_id UUID REFERENCES holdings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_is_active ON accounts(is_active);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_status ON transactions(status);

CREATE INDEX idx_transaction_rules_user_id ON transaction_rules(user_id);
CREATE INDEX idx_transaction_rules_enabled ON transaction_rules(enabled);

CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_next_run ON recurring_transactions(next_run_at);
CREATE INDEX idx_recurring_transactions_enabled ON recurring_transactions(enabled);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(period_type, year, month);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE UNIQUE INDEX idx_budgets_unique_period_category
  ON budgets(user_id, period_type, year, COALESCE(month, 0), category_id);

CREATE INDEX idx_holdings_user_id ON holdings(user_id);
CREATE INDEX idx_holdings_asset_symbol ON holdings(asset_symbol);

CREATE INDEX idx_prices_asset_symbol ON prices(asset_symbol);
CREATE INDEX idx_prices_as_of ON prices(as_of DESC);
CREATE INDEX idx_prices_user_id ON prices(user_id);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_asset_symbol ON trades(asset_symbol);
CREATE INDEX idx_trades_date ON trades(date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Settings policies
CREATE POLICY "Users can view their own settings" ON settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Transaction rules policies
CREATE POLICY "Users can view their own transaction rules" ON transaction_rules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transaction rules" ON transaction_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transaction rules" ON transaction_rules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transaction rules" ON transaction_rules
  FOR DELETE USING (auth.uid() = user_id);

-- Recurring transactions policies
CREATE POLICY "Users can view their own recurring transactions" ON recurring_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring transactions" ON recurring_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring transactions" ON recurring_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring transactions" ON recurring_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Holdings policies
CREATE POLICY "Users can view their own holdings" ON holdings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings" ON holdings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings" ON holdings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings" ON holdings
  FOR DELETE USING (auth.uid() = user_id);

-- Prices policies (user_id can be null for shared/public prices)
CREATE POLICY "Users can view their own prices and public prices" ON prices
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own prices" ON prices
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own prices" ON prices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prices" ON prices
  FOR DELETE USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view their own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_rules_updated_at BEFORE UPDATE ON transaction_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON holdings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA (Default Categories)
-- Note: These will be inserted per-user via the seed script or on first login
-- ============================================================================
