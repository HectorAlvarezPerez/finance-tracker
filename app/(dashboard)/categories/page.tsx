import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { CategoriesList } from "@/components/categories/categories-list"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"
import { ImportDefaultCategoriesButton } from "@/components/categories/import-default-categories-button"

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = createServerClient()
  const t = await getTranslations('categories')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("type", { ascending: true })
    .order("name", { ascending: true })

  // Get user locale for default categories
  const { data: settings } = await supabase
    .from('settings')
    .select('locale')
    .eq('user_id', user.id)
    .single()

  const hasCategories = !!(categories && categories.length > 0)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
            {hasCategories && (
              <div className="mt-2 text-sm text-muted-foreground bg-muted/50 inline-block px-2 py-1 rounded-md">
                {categories?.length || 0} Total
              </div>
            )}
          </div>
          <AddCategoryDialog userId={user.id} />
        </div>

        {!hasCategories && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium">{t('gettingStarted')}</p>
              <p className="text-xs text-muted-foreground">
                {t('importDefault')}
              </p>
            </div>
            <ImportDefaultCategoriesButton
              userId={user.id}
              locale={settings?.locale || 'en-US'}
              hasCategories={hasCategories}
            />
          </div>
        )}
      </div>

      <CategoriesList categories={categories || []} userId={user.id} />
    </div >
  )
}

