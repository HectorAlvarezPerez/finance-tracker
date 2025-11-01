import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error("Email check error: Supabase service credentials missing")
      return NextResponse.json(
        { error: "Unable to verify email at this time" },
        { status: 503 }
      )
    }

    const supabase = createServiceClient()
    const authSchema = (supabase as any).schema("auth")
    const { data, error } = await authSchema
      .from("users")
      .select("id")
      .eq("email", trimmedEmail)
      .maybeSingle()

    if (error) {
      console.error("Email check error:", error)
      return NextResponse.json(
        { error: "Unable to verify email at this time" },
        { status: 500 }
      )
    }

    return NextResponse.json({ exists: Boolean(data) })
  } catch (error: any) {
    console.error("Email check error:", error)
    return NextResponse.json(
      { error: "Unable to verify email at this time" },
      { status: 500 }
    )
  }
}
