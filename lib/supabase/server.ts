import { createServerComponentClient, createServerActionClient as createSAClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export const createServerClient = async (): Promise<any> => {
  const cookieStore = await cookies()
  return createServerComponentClient<any>(
    {
      // auth-helpers expects a sync cookie getter at runtime.
      cookies: () => cookieStore,
    } as any
  )
}

export const createServerActionClient = async (): Promise<any> => {
  const cookieStore = await cookies()
  return createSAClient<any>(
    {
      // auth-helpers expects a sync cookie getter at runtime.
      cookies: () => cookieStore,
    } as any
  )
}
