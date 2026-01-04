import { createServerClient } from "@/lib/supabase/server"
import { getDefaultCategories } from "@/lib/data/default-categories"
import { v4 as uuidv4 } from "uuid"

export async function createDemoAccount() {
    const supabase = createServerClient()

    // Generate a random demo email and password
    const uniqueId = uuidv4().slice(0, 8)
    const email = `demo_${uniqueId}@finance.local`
    const password = `demo_${uuidv4()}`

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: "Demo User",
                is_demo: true,
            },
        },
    })

    if (authError || !authData.user) {
        throw new Error(authError?.message || "Failed to create demo account")
    }

    return { user: authData.user, email, password }
}

export async function seedDemoData(userId: string) {
    const supabase = createServerClient()
    const today = new Date().toISOString().split("T")[0]

    try {
        // 1. Create Default Categories (Spanish by default for now as per init-default-data)
        const defaultCategories = getDefaultCategories("es")

        // Insert categories and return them so we can map IDs
        const { data: categories, error: catError } = await supabase
            .from("categories")
            .insert(
                defaultCategories.map((cat) => ({
                    user_id: userId,
                    name: cat.name,
                    type: cat.type,
                    color: cat.color,
                    icon: cat.icon,
                }))
            )
            .select()

        if (catError || !categories) throw new Error("Failed to seed categories")

        // Helper to find category ID by name
        const getCatId = (name: string) => categories.find((c) => c.name === name)?.id

        // 2. Create Accounts
        const { data: accounts, error: accError } = await supabase
            .from("accounts")
            .insert([
                {
                    user_id: userId,
                    name: "Cuenta Principal",
                    type: "bank",
                    balance: 0, // We'll let transactions drive the balance or set an initial one? 
                    // Actually, let's set an initial balance and then transactions will adjust it if we were calculating strictly,
                    // but for now simple seeded transactions usually imply just showing data. 
                    // Let's set a realistic starting balance.
                    currency: "EUR",
                },
                {
                    user_id: userId,
                    name: "Efectivo",
                    type: "cash",
                    balance: 0,
                    currency: "EUR",
                },
            ])
            .select()

        if (accError || !accounts) throw new Error("Failed to seed accounts")

        const bankAccountId = accounts.find((a) => a.type === "bank")?.id
        const cashAccountId = accounts.find((a) => a.type === "cash")?.id

        if (!bankAccountId || !cashAccountId) throw new Error("Failed to retrieve created accounts")

        // 3. Create Sample Transactions
        // We want some data for the current month and previous months to show trends

        const transactions = []

        // Helper for dates
        const getDate = (daysAgo: number) => {
            const date = new Date()
            date.setDate(date.getDate() - daysAgo)
            return date.toISOString().split("T")[0]
        }

        // Salary (Income)
        transactions.push({
            user_id: userId,
            account_id: bankAccountId,
            category_id: getCatId("Nómina"),
            amount: 2500,
            date: getDate(2), // 2 days ago
            description: "Nómina Mensual",
            status: "posted" as const, // Although we removed status column, types might explicitly expect it if I missed something? 
            // WAIT. I just removed status column. I should NOT include it.
        })

        // However, I need to double check if I missed updating the database type definitions in `types/database.ts` 
        // or if `insert` allows extra properties (it shouldn't). 
        // The previous task removed status from types/database.ts so I must NOT include it.

        /** 
         * CORRECTION: I removed status column. 
         * Removing "status" key from objects below.
         */

        // RE-DEFINING Transactions without status
        const demoTransactions = [
            // Income
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Nómina"),
                amount: 2500,
                date: getDate(2),
                description: "Nómina Mensual",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Freelance"),
                amount: 450,
                date: getDate(10),
                description: "Proyecto Web",
            },

            // Expenses - Recent
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Comida y Supermercado"),
                amount: -125.50,
                date: getDate(1),
                description: "Compra Semanal Mercadona",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Restaurantes y Cafés"),
                amount: -45.00,
                date: getDate(3),
                description: "Cena con amigos",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Transporte"),
                amount: -30.00,
                date: getDate(5),
                description: "Gasolina",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Suscripciones"),
                amount: -14.99,
                date: getDate(15),
                description: "Netflix",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Alquiler"),
                amount: -850.00,
                date: getDate(0).substring(0, 8) + '01', // First of current month roughly
                description: "Alquiler Piso",
            },

            // Previous Month Data (for charts)
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Nómina"),
                amount: 2500,
                date: getDate(32),
                description: "Nómina Mes Pasado",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Comida y Supermercado"),
                amount: -400.00,
                date: getDate(35),
                description: "Compras Mes Pasado",
            },
            {
                user_id: userId,
                account_id: bankAccountId,
                category_id: getCatId("Viajes"),
                amount: -300.00,
                date: getDate(40),
                description: "Escapada Fin de Semana",
            },
        ]

        const { error: txError } = await supabase
            .from("transactions")
            .insert(demoTransactions as any)

        if (txError) throw new Error("Failed to seed transactions: " + txError.message)

        return { success: true }

    } catch (error) {
        console.error("Seed Demo Data Error:", error)
        // We don't rethrow here to allow login to proceed even if seeding partially fails, 
        // but ideally we should probably fail. 
        // Let's rethrow to be safe.
        throw error
    }
}
