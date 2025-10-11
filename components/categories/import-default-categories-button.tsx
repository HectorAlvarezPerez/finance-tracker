"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getDefaultCategories } from "@/lib/default-categories"

export function ImportDefaultCategoriesButton({ 
  userId, 
  locale = 'es',
  hasCategories 
}: { 
  userId: string
  locale?: string
  hasCategories: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  // Don't show button if user already has categories
  if (hasCategories) {
    return null
  }

  const handleImport = async () => {
    setLoading(true)

    try {
      // Get default categories
      const defaultCategories = getDefaultCategories(locale)

      // Prepare for insertion
      const categoriesToInsert = defaultCategories.map(cat => ({
        user_id: userId,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        icon: cat.icon,
      }))

      // Insert categories
      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert as any)

      if (error) throw error

      toast({
        title: "¡Éxito!",
        description: `${defaultCategories.length} categorías importadas correctamente`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al importar categorías",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleImport} 
      disabled={loading}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {loading ? "Importando..." : "Importar Categorías Predeterminadas"}
    </Button>
  )
}

