import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error("Email check error: Supabase service credentials missing")
      return NextResponse.json({ error: "Unable to verify email at this time" }, { status: 503 })
    }

    const adminUrl = new URL("/auth/v1/admin/users", supabaseUrl)
    adminUrl.searchParams.set("email", trimmedEmail)

    const response = await fetch(adminUrl, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    })

    if (response.status === 404) {
      return NextResponse.json({ exists: false })
    }

    if (!response.ok) {
      let details: any = null
      try {
        details = await response.json()
      } catch (jsonError) {
        // no-op; response not JSON
      }
      console.error("Email check error: admin fetch failed", {
        status: response.status,
        details,
      })
      return NextResponse.json({ error: "Unable to verify email at this time" }, { status: 500 })
    }

    let exists = false
    try {
      const data = await response.json()
      const users = Array.isArray(data?.users) ? data.users : []
      exists = users.some((user: { email?: string }) => user.email?.toLowerCase() === trimmedEmail)
    } catch (jsonError) {
      console.error("Email check error: failed to parse admin response", jsonError)
      return NextResponse.json({ error: "Unable to verify email at this time" }, { status: 500 })
    }

    return NextResponse.json({ exists })
  } catch (error: any) {
    console.error("Email check error:", error)
    return NextResponse.json({ error: "Unable to verify email at this time" }, { status: 500 })
  }
}
