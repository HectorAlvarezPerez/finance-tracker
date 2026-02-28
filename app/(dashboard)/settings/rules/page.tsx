import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getRules } from "@/lib/actions/rules"
import { RulesList } from "@/components/rules/rules-list"
import { AddRuleDialog } from "@/components/rules/add-rule-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function RulesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const rules = await getRules()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name")

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("name")

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Transaction Rules</h1>
          <p className="text-muted-foreground">
            Manage auto-categorization rules for your transactions.
          </p>
        </div>
        <div className="sm:ml-auto">
          <AddRuleDialog categories={categories || []} accounts={accounts || []} />
        </div>
      </div>

      <RulesList rules={rules || []} categories={categories || []} accounts={accounts || []} />
    </div>
  )
}
