"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Tag } from "lucide-react"
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
  const t = useTranslations('categories')


  // Group categories by type
  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")
  const otherCategories = categories.filter(
    (c) => c.type === "transfer" || c.type === "investment"
  )

  const CategoryCard = ({ category }: { category: Category }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <div>
          <p className="font-medium">{category.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setEditingCategory(category)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setDeletingCategory(category)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('noCategories')}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {t('createFirstCategory')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {incomeCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  Income
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({incomeCategories.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {incomeCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </CardContent>
          </Card>
        )}

        {expenseCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-red-600">
                  Expense
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({expenseCategories.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {expenseCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </CardContent>
          </Card>
        )}

        {otherCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Other</Badge>
                <span className="text-sm text-muted-foreground">
                  ({otherCategories.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {otherCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>

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
    </>
  )
}

