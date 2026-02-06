import { createServerComponentClient, createServerActionClient as createSAClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export const createServerClient = () => {
  return createServerComponentClient<any>({ cookies })
}

export const createServerActionClient = () => {
  return createSAClient<any>({ cookies })
}

