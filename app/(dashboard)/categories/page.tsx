import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CategoriesList } from "@/components/categories/categories-list"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"

export default async function CategoriesPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", session.user.id)
    .order("type", { ascending: true })
    .order("name", { ascending: true })

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your income and expense categories
          </p>
        </div>
        <AddCategoryDialog userId={session.user.id} />
      </div>

      <CategoriesList categories={categories || []} userId={session.user.id} />
    </div>
  )
}

