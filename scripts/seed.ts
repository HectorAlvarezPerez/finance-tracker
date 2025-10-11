import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"
import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

// This script seeds default categories for a user
// Run: npm run db:seed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Please check your .env file.")
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

const defaultCategories = [
  // Income categories
  { name: "Salary", type: "income" as const, color: "#22c55e", icon: "dollar-sign" },
  { name: "Freelance", type: "income" as const, color: "#10b981", icon: "briefcase" },
  { name: "Investments", type: "income" as const, color: "#14b8a6", icon: "trending-up" },
  { name: "Other Income", type: "income" as const, color: "#06b6d4", icon: "plus-circle" },

  // Expense categories
  { name: "Groceries", type: "expense" as const, color: "#ef4444", icon: "shopping-cart" },
  { name: "Dining Out", type: "expense" as const, color: "#f97316", icon: "utensils" },
  { name: "Transportation", type: "expense" as const, color: "#f59e0b", icon: "car" },
  { name: "Rent/Mortgage", type: "expense" as const, color: "#eab308", icon: "home" },
  { name: "Utilities", type: "expense" as const, color: "#84cc16", icon: "zap" },
  { name: "Healthcare", type: "expense" as const, color: "#3b82f6", icon: "heart" },
  { name: "Entertainment", type: "expense" as const, color: "#8b5cf6", icon: "film" },
  { name: "Shopping", type: "expense" as const, color: "#a855f7", icon: "shopping-bag" },
  { name: "Subscriptions", type: "expense" as const, color: "#d946ef", icon: "refresh-cw" },
  { name: "Travel", type: "expense" as const, color: "#ec4899", icon: "plane" },
  { name: "Education", type: "expense" as const, color: "#6366f1", icon: "book" },
  { name: "Other Expenses", type: "expense" as const, color: "#64748b", icon: "more-horizontal" },

  // Transfer/Investment
  { name: "Transfer", type: "transfer" as const, color: "#0ea5e9", icon: "arrow-right-left" },
  { name: "Investment Purchase", type: "investment" as const, color: "#14b8a6", icon: "trending-up" },
]

async function seed() {
  console.log("🌱 Starting seed process...")

  // Get the first user (you can modify this to seed for a specific user)
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error("Error fetching users:", usersError.message)
    process.exit(1)
  }

  if (!users || users.users.length === 0) {
    console.log("⚠️  No users found. Please create a user account first.")
    process.exit(0)
  }

  const userId = users.users[0].id
  console.log(`📝 Seeding data for user: ${users.users[0].email}`)

  // Check if categories already exist
  const { data: existingCategories } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (existingCategories && existingCategories.length > 0) {
    console.log("⚠️  Categories already exist for this user. Skipping category seed.")
  } else {
    // Insert categories
    const categoriesToInsert = defaultCategories.map((cat) => ({
      ...cat,
      user_id: userId,
    }))

    const { error: categoriesError } = await supabase
      .from("categories")
      .insert(categoriesToInsert as any)

    if (categoriesError) {
      console.error("Error inserting categories:", categoriesError.message)
    } else {
      console.log(`✅ Inserted ${defaultCategories.length} default categories`)
    }
  }

  // Create a default checking account
  const { data: existingAccounts } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (!existingAccounts || existingAccounts.length === 0) {
    const { error: accountError } = await supabase.from("accounts").insert({
      user_id: userId,
      name: "Main Checking",
      type: "checking",
      currency: "EUR",
      is_active: true,
    } as any)

    if (accountError) {
      console.error("Error creating account:", accountError.message)
    } else {
      console.log("✅ Created default checking account")
    }
  }

  // Create default settings
  const { data: existingSettings } = await supabase
    .from("settings")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (!existingSettings || existingSettings.length === 0) {
    const { error: settingsError } = await supabase.from("settings").insert({
      user_id: userId,
      default_currency: "EUR",
      locale: "en-US",
      theme: "system",
      insights_opt_in: true,
    } as any)

    if (settingsError) {
      console.error("Error creating settings:", settingsError.message)
    } else {
      console.log("✅ Created default settings")
    }
  }

  console.log("🎉 Seed completed successfully!")
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error)
  process.exit(1)
})

