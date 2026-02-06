import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<any>({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Set locale cookie from user settings if logged in and not already set
  if (user && !req.cookies.get('NEXT_LOCALE')) {
    const { data: settings } = await supabase
      .from('settings')
      .select('locale')
      .eq('user_id', user.id)
      .single()

    if (settings?.locale) {
      res.cookies.set('NEXT_LOCALE', settings.locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      })
    }
  }

  // Protect routes
  const protectedRoutes = [
    "/dashboard",
    "/transactions",
    "/recurring",
    "/accounts",
    "/budgets",
    "/insights",
    "/portfolio",
    "/settings",
  ]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (
    user &&
    (req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/signup" ||
      req.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
}

