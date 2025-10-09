import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountsList } from "@/components/accounts/accounts-list"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"

export default async function AccountsPage() {
  const supabase = createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts, savings, and investments
          </p>
        </div>
        <AddAccountDialog userId={user.id} />
      </div>

      <AccountsList accounts={accounts || []} userId={user.id} />
    </div>
  )
}

