import { v4 as uuidv4 } from "uuid"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { getDefaultCategories } from "@/lib/data/default-categories"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerClient } from "@/lib/supabase/server"

export async function createDemoAccount() {
  const uniqueId = uuidv4().slice(0, 8)
  const email = `demo_${uniqueId}@finance.local`
  const password = `demo_${uuidv4()}`

  const adminClient = createAdminClient()
  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured for demo account creation.")
  }

  const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: "Demo User",
      is_demo: true,
    },
  })

  if (adminError || !adminData.user) {
    throw new Error(adminError?.message || "Failed to create demo account")
  }

  return { user: adminData.user, email, password }
}

export async function seedDemoData(
  userId: string,
  client?: SupabaseClient<Database>
) {
  const adminClient = createAdminClient()
  const supabase = client ?? adminClient ?? (await createServerClient())

  try {
    const { count: accountCount, error: accountCountError } = await supabase
      .from("accounts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (!accountCountError && (accountCount ?? 0) > 0) {
      return { success: true }
    }

    const defaultCategories = getDefaultCategories("es")
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .upsert(
        defaultCategories.map((category) => ({
          user_id: userId,
          name: category.name,
          type: category.type,
          color: category.color,
          icon: category.icon,
        })),
        { onConflict: "user_id,name" }
      )
      .select()

    if (catError || !categories?.length) {
      throw new Error(`Failed to seed categories: ${catError?.message ?? "no categories returned"}`)
    }

    const getCategoryId = (name: string) =>
      categories.find((category: any) => category.name === name)?.id

    const { data: accounts, error: accError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: userId,
          name: "Cuenta Principal",
          type: "checking",
          currency: "EUR",
        },
        {
          user_id: userId,
          name: "Efectivo",
          type: "other",
          currency: "EUR",
        },
      ])
      .select()

    if (accError || !accounts) {
      throw new Error(`Failed to seed accounts: ${accError?.message ?? "insert failed"}`)
    }

    const bankAccountId = accounts.find((account: any) => account.name === "Cuenta Principal")?.id
    if (!bankAccountId) {
      throw new Error("Failed to create demo bank account")
    }

    const getDate = (daysAgo: number) => {
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      return date.toISOString().split("T")[0]
    }

    const firstDayOfCurrentMonth = new Date()
    firstDayOfCurrentMonth.setDate(1)
    const monthStart = firstDayOfCurrentMonth.toISOString().split("T")[0]

    const demoTransactions = [
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Nómina"),
        amount: 2500,
        date: getDate(2),
        description: "Nómina Mensual",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Freelance"),
        amount: 450,
        date: getDate(10),
        description: "Proyecto Web",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Comida y Supermercado"),
        amount: -125.5,
        date: getDate(1),
        description: "Compra Semanal Mercadona",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Restaurantes y Cafés"),
        amount: -45,
        date: getDate(3),
        description: "Cena con amigos",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Transporte"),
        amount: -30,
        date: getDate(5),
        description: "Gasolina",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Suscripciones"),
        amount: -14.99,
        date: getDate(15),
        description: "Netflix",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Alquiler"),
        amount: -850,
        date: monthStart,
        description: "Alquiler Piso",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Nómina"),
        amount: 2500,
        date: getDate(32),
        description: "Nómina Mes Pasado",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Comida y Supermercado"),
        amount: -400,
        date: getDate(35),
        description: "Compras Mes Pasado",
      },
      {
        user_id: userId,
        account_id: bankAccountId,
        category_id: getCategoryId("Viajes"),
        amount: -300,
        date: getDate(40),
        description: "Escapada Fin de Semana",
      },
    ]

    const { error: txError } = await supabase
      .from("transactions")
      .insert(demoTransactions as any)

    if (txError) {
      throw new Error(`Failed to seed transactions: ${txError.message}`)
    }

    const demoBudgets = [
      {
        user_id: userId,
        category_id: getCategoryId("Comida y Supermercado"),
        period_type: "monthly",
        year: 2000,
        month: 1,
        currency: "EUR",
        amount: 350,
        notes: "Presupuesto mensual recurrente de comida",
      },
      {
        user_id: userId,
        category_id: getCategoryId("Restaurantes y Cafés"),
        period_type: "monthly",
        year: 2000,
        month: 1,
        currency: "EUR",
        amount: 120,
        notes: "Presupuesto mensual recurrente de ocio",
      },
      {
        user_id: userId,
        category_id: getCategoryId("Transporte"),
        period_type: "monthly",
        year: 2000,
        month: 1,
        currency: "EUR",
        amount: 90,
        notes: "Presupuesto mensual recurrente de transporte",
      },
      {
        user_id: userId,
        category_id: getCategoryId("Viajes"),
        period_type: "annual",
        year: 2000,
        month: null,
        currency: "EUR",
        amount: 1800,
        notes: "Presupuesto anual recurrente de viajes",
      },
      {
        user_id: userId,
        category_id: getCategoryId("Salud y Farmacia"),
        period_type: "annual",
        year: 2000,
        month: null,
        currency: "EUR",
        amount: 600,
        notes: "Presupuesto anual recurrente de salud",
      },
    ].filter((budget) => budget.category_id)

    const { error: clearBudgetsError } = await supabase
      .from("budgets")
      .delete()
      .eq("user_id", userId)

    if (clearBudgetsError) {
      throw new Error(`Failed to clear demo budgets: ${clearBudgetsError.message}`)
    }

    if (demoBudgets.length > 0) {
      const { error: budgetError } = await supabase
        .from("budgets")
        .insert(demoBudgets as any)

      if (budgetError) {
        throw new Error(`Failed to seed budgets: ${budgetError.message}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Seed Demo Data Error:", error)
    throw error
  }
}
