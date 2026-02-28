export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "checking" | "savings" | "brokerage" | "crypto" | "other"
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: "checking" | "savings" | "brokerage" | "crypto" | "other"
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: "checking" | "savings" | "brokerage" | "crypto" | "other"
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "income" | "expense" | "transfer" | "investment"
          color: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: "income" | "expense" | "transfer" | "investment"
          color?: string
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: "income" | "expense" | "transfer" | "investment"
          color?: string
          icon?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          period_type: "monthly" | "annual"
          year: number
          month: number | null
          currency: string
          amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          period_type: "monthly" | "annual"
          year: number
          month?: number | null
          currency?: string
          amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          period_type?: "monthly" | "annual"
          year?: number
          month?: number | null
          currency?: string
          amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          date: string
          amount: number
          currency: string
          description: string
          category_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          date: string
          amount: number
          currency?: string
          description: string
          category_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          date?: string
          amount?: number
          currency?: string
          description?: string
          category_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transaction_rules: {
        Row: {
          id: string
          user_id: string
          pattern: string
          default_category_id: string | null
          default_account_id: string | null
          action: "categorize" | "rename"
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pattern: string
          default_category_id?: string | null
          default_account_id?: string | null
          action?: "categorize" | "rename"
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pattern?: string
          default_category_id?: string | null
          default_account_id?: string | null
          action?: "categorize" | "rename"
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      holdings: {
        Row: {
          id: string
          user_id: string
          asset_name: string
          asset_symbol: string | null
          asset_type: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold" | "etf"
          quantity: number
          weekly_quantity: number
          monthly_quantity: number
          recurring_last_applied_at: string
          average_buy_price: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_name: string
          asset_symbol?: string | null
          asset_type: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold" | "etf"
          quantity: number
          weekly_quantity?: number
          monthly_quantity?: number
          recurring_last_applied_at?: string
          average_buy_price: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_name?: string
          asset_symbol?: string | null
          asset_type?: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold" | "etf"
          quantity?: number
          weekly_quantity?: number
          monthly_quantity?: number
          recurring_last_applied_at?: string
          average_buy_price?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          user_id: string | null
          asset_symbol: string
          source: "manual" | "api"
          price: number
          currency: string
          as_of: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          asset_symbol: string
          source?: "manual" | "api"
          price: number
          currency?: string
          as_of: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          asset_symbol?: string
          source?: "manual" | "api"
          price?: number
          currency?: string
          as_of?: string
          created_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          asset_symbol: string
          date: string
          side: "buy" | "sell"
          quantity: number
          price: number
          fees: number
          currency: string
          holding_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_symbol: string
          date: string
          side: "buy" | "sell"
          quantity: number
          price: number
          fees?: number
          currency?: string
          holding_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_symbol?: string
          date?: string
          side?: "buy" | "sell"
          quantity?: number
          price?: number
          fees?: number
          currency?: string
          holding_id?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          default_currency: string
          locale: string
          theme: string
          insights_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_currency?: string
          locale?: string
          theme?: string
          insights_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_currency?: string
          locale?: string
          theme?: string
          insights_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
