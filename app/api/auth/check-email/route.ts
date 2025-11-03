import { AuthApiError } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/client"

export const runtime = "nodejs"

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

    let page = 1
    const perPage = 200
    let exists = false

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      })

      if (error) {
        if (
          error instanceof AuthApiError &&
          (error.status === 400 || error.status === 404)
        ) {
          break
        }

        console.error("Email check error:", error)
        return NextResponse.json(
          { error: "Unable to verify email at this time" },
          { status: 500 }
        )
      }

      const users = Array.isArray((data as any)?.users)
        ? (data as any).users
        : []

      if (
        users.some(
          (user: { email?: string }) => user.email?.toLowerCase() === trimmedEmail
        )
      ) {
        exists = true
        break
      }

      const nextPage = (data as any)?.nextPage
      if (!nextPage || nextPage <= page) {
        break
      }
      page = nextPage
    }

    return NextResponse.json({ exists })
  } catch (error: any) {
    console.error("Email check error:", error)
    return NextResponse.json(
      { error: "Unable to verify email at this time" },
      { status: 500 }
    )
  }
}
