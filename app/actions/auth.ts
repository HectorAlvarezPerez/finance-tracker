"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createDemoAccount, seedDemoData } from "@/lib/services/demo-service"

export async function createDemoSession() {
    try {
        const adminClient = createAdminClient()

        if (!adminClient) {
            throw new Error(
                "Demo mode is not configured. Please contact support."
            )
        }

        // 1. Create a fresh demo account using admin client
        const { user, email, password } = await createDemoAccount()

        // 2. Seed demo data using admin client (bypasses RLS)
        await seedDemoData(user.id, adminClient)

        // 3. Return credentials for client-side sign-in
        // This allows the browser to establish the session cookies properly
        return {
            success: true as const,
            credentials: { email, password }
        }
    } catch (error: any) {
        console.error("Demo Session Creation Error:", error)

        return {
            success: false as const,
            error: error?.message || "Failed to create demo session. Please try again.",
        }
    }
}
