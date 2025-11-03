import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const defaultNext = type === "recovery" ? "/reset-password" : "/dashboard"
  const next = requestUrl.searchParams.get("next") || defaultNext

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("Auth callback error:", error)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error?.message ?? "verification_failed")}`,
        requestUrl.origin
      )
    )
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
