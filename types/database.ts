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
          status: "posted" | "pending"
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
          status?: "posted" | "pending"
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
          status?: "posted" | "pending"
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
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          description: string
          amount: number
          category_id: string | null
          currency: string
          frequency: "daily" | "weekly" | "monthly" | "yearly"
          interval_value: number
          day_of_month: number | null
          day_of_week: number | null
          next_run_at: string
          timezone: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          description: string
          amount: number
          category_id?: string | null
          currency?: string
          frequency: "daily" | "weekly" | "monthly" | "yearly"
          interval_value?: number
          day_of_month?: number | null
          day_of_week?: number | null
          next_run_at: string
          timezone?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          description?: string
          amount?: number
          category_id?: string | null
          currency?: string
          frequency?: "daily" | "weekly" | "monthly" | "yearly"
          interval_value?: number
          day_of_month?: number | null
          day_of_week?: number | null
          next_run_at?: string
          timezone?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          month: string
          currency: string
          amount_total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          month: string
          currency?: string
          amount_total: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          month?: string
          currency?: string
          amount_total?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          user_id: string
          asset_symbol: string
          asset_type: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold"
          quantity: number
          cost_basis_total: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_symbol: string
          asset_type: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold"
          quantity: number
          cost_basis_total: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_symbol?: string
          asset_type?: "index_fund" | "bond_fund" | "crypto" | "stock" | "gold"
          quantity?: number
          cost_basis_total?: number
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
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

