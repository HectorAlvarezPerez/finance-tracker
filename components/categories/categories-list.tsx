"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Tag, Search, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"
import type { Database } from "@/types/database"
import { useState } from "react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { useTranslations } from "next-intl"

type Category = Database["public"]["Tables"]["categories"]["Row"]

export function CategoriesList({
  categories,
  userId,
}: {
  categories: Category[]
  userId: string
}) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations('categories')

  // Filter categories based on search
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group categories by type
  const incomeCategories = filteredCategories.filter((c) => c.type === "income")
  const expenseCategories = filteredCategories.filter((c) => c.type === "expense")
  const otherCategories = filteredCategories.filter(
    (c) => c.type === "transfer" || c.type === "investment"
  )

  const CategoryCard = ({ category }: { category: Category }) => (
    <div className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/50 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          {/* If we had icons, we would render them here. For now, first letter */}
          <span className="font-bold text-lg">{category.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-semibold text-base">{category.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setEditingCategory(category)}
          title={t('edit')}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
          onClick={() => setDeletingCategory(category)}
          title={t('delete')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (categories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('noCategories')}</h3>
          <p className="text-muted-foreground max-w-sm">
            {t('createFirstCategory')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search')}
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Income Column */}
        {(incomeCategories.length > 0 || (searchQuery && categories.some(c => c.type === 'income'))) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
                {t('income')}
              </h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {incomeCategories.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
              {incomeCategories.length === 0 && searchQuery && (
                <p className="text-sm text-muted-foreground italic text-center py-4">{t('noResults')}</p>
              )}
            </div>
          </div>
        )}

        {/* Expense Column */}
        {(expenseCategories.length > 0 || (searchQuery && categories.some(c => c.type === 'expense'))) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-red-600">
                <TrendingDown className="h-5 w-5" />
                {t('expense')}
              </h3>
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {expenseCategories.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
              {expenseCategories.length === 0 && searchQuery && (
                <p className="text-sm text-muted-foreground italic text-center py-4">{t('noResults')}</p>
              )}
            </div>
          </div>
        )}

        {/* Other Column */}
        {(otherCategories.length > 0 || (searchQuery && categories.some(c => ['transfer', 'investment'].includes(c.type)))) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
                Other
              </h3>
              <Badge variant="secondary">
                {otherCategories.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {otherCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
              {otherCategories.length === 0 && searchQuery && (
                <p className="text-sm text-muted-foreground italic text-center py-4">{t('noResults')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {searchQuery && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('noSearchResults')}</p>
        </div>
      )}

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
        />
      )}
    </div>
  )
}

