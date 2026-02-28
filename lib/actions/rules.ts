"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/types/database"

type TransactionRule = Database["public"]["Tables"]["transaction_rules"]["Row"]
type InsertTransactionRule = Database["public"]["Tables"]["transaction_rules"]["Insert"]
type UpdateTransactionRule = Database["public"]["Tables"]["transaction_rules"]["Update"]

export async function getRules() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("transaction_rules")
    .select(
      `
      *,
      categories:category_id(id, name, color, icon),
      accounts:default_account_id(id, name, type)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createRule(data: Omit<InsertTransactionRule, "user_id">) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("transaction_rules").insert({
    ...data,
    user_id: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/settings/rules")
}

export async function updateRule(id: string, data: UpdateTransactionRule) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("transaction_rules")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/settings/rules")
}

export async function deleteRule(id: string) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("transaction_rules")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/settings/rules")
}

export async function toggleRule(id: string, enabled: boolean) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("transaction_rules")
    .update({ enabled })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/settings/rules")
}
