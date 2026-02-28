"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import type { Database } from "@/types/database"
import { AlertTriangle } from "lucide-react"

type Category = Database["public"]["Tables"]["categories"]["Row"]

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleDelete = async () => {
    setLoading(true)

    try {
      // Save category data before deleting for undo functionality
      const deletedCategory = {
        user_id: category.user_id,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      }

      const { error } = await supabase.from("categories").delete().eq("id", category.id)

      if (error) throw error

      // Show success toast with undo option
      toast({
        title: "Success",
        description: "Category deleted successfully",
        action: (
          <ToastAction
            altText="Undo delete"
            onClick={async () => {
              try {
                const { error: undoError } = await supabase
                  .from("categories")
                  .insert(deletedCategory)

                if (undoError) throw undoError

                toast({
                  title: "Category restored",
                  description: "The category has been restored successfully",
                })

                router.refresh()
              } catch (undoError: any) {
                toast({
                  title: "Error",
                  description: "Failed to restore category",
                  variant: "destructive",
                })
              }
            }}
          >
            Undo
          </ToastAction>
        ),
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category.name}&quot;?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Transactions with this category will have their category
            removed.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
