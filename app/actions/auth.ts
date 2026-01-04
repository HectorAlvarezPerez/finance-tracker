"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createDemoAccount, seedDemoData } from "@/lib/services/demo-service"
import { redirect } from "next/navigation"

export async function loginAsDemoUser() {
    try {
        // 1. Create a fresh demo account
        const { user, email, password } = await createDemoAccount()

        // 2. Seed data for this account
        await seedDemoData(user.id)

        // 3. Login (Sign In) to establish session
        // We need to sign in again to ensure the session is set in the cookies
        const supabase = createServerClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            throw signInError
        }

    } catch (error) {
        console.error("Demo Login Error:", error)
        // In server actions, we propagate error or return it. 
        // Return unique string or object to handle in UI.
        return { error: "Failed to create demo session. Please try again." }
    }

    // 4. Redirect to dashboard
    redirect("/dashboard")
}
