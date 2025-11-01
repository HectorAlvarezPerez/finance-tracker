import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const defaultNext = type === "recovery" ? "/reset-password" : "/dashboard"
  const next = requestUrl.searchParams.get("next") || defaultNext

  if (code) {
    const supabase = createServerClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to the next URL or dashboard
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(
    new URL("/login?error=verification_failed", requestUrl.origin)
  )
}
