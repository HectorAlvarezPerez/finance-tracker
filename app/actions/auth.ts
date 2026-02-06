"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createServerActionClient } from "@/lib/supabase/server"
import { createDemoAccount, seedDemoData } from "@/lib/services/demo-service"

export async function loginAsDemoUser() {
    const supabase = createServerActionClient()

    try {
        const adminClient = createAdminClient()

        if (adminClient) {
            // 1. Create a fresh demo account
            const { user, email, password } = await createDemoAccount()

            // 2. Login (Sign In) to establish session cookies
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                throw signInError
            }

            // 3. Seed account data for dashboard views
            await seedDemoData(user.id, supabase)

            return { success: true as const }
        }

        // Fallback: use Supabase anonymous auth when service role is unavailable.
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously({
            options: {
                data: {
                    full_name: "Demo User",
                    is_demo: true,
                },
            },
        })

        if (anonError || !anonData.user) {
            throw new Error(
                "Demo mode is not configured. Add SUPABASE_SERVICE_ROLE_KEY to your deployment env or enable Supabase anonymous sign-ins."
            )
        }

        await seedDemoData(anonData.user.id, supabase)

        return { success: true as const }
    } catch (error: any) {
        console.error("Demo Login Error:", error)

        try {
            await supabase.auth.signOut()
        } catch (signOutError) {
            console.error("Demo Login Cleanup Error:", signOutError)
        }

        return {
            success: false as const,
            error: error?.message || "Failed to create demo session. Please try again.",
        }
    }
}
