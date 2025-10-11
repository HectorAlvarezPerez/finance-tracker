"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"

type Category = Database["public"]["Tables"]["categories"]["Row"]

const colorOptions = [
  // Reds & Roses
  { name: "Red", value: "#ef4444" },
  { name: "Dark Red", value: "#dc2626" },
  { name: "Light Red", value: "#f87171" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Light Rose", value: "#fb7185" },
  
  // Oranges
  { name: "Orange", value: "#f97316" },
  { name: "Dark Orange", value: "#ea580c" },
  { name: "Light Orange", value: "#fb923c" },
  
  // Ambers & Yellows
  { name: "Amber", value: "#f59e0b" },
  { name: "Dark Amber", value: "#d97706" },
  { name: "Light Amber", value: "#fbbf24" },
  { name: "Yellow", value: "#eab308" },
  { name: "Dark Yellow", value: "#ca8a04" },
  
  // Limes & Greens
  { name: "Lime", value: "#84cc16" },
  { name: "Dark Lime", value: "#65a30d" },
  { name: "Light Lime", value: "#a3e635" },
  { name: "Green", value: "#22c55e" },
  { name: "Dark Green", value: "#16a34a" },
  { name: "Light Green", value: "#4ade80" },
  
  // Emeralds & Teals
  { name: "Emerald", value: "#10b981" },
  { name: "Dark Emerald", value: "#059669" },
  { name: "Light Emerald", value: "#34d399" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Dark Teal", value: "#0d9488" },
  { name: "Light Teal", value: "#2dd4bf" },
  
  // Cyans & Skys
  { name: "Cyan", value: "#06b6d4" },
  { name: "Dark Cyan", value: "#0891b2" },
  { name: "Light Cyan", value: "#22d3ee" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Dark Sky", value: "#0284c7" },
  { name: "Light Sky", value: "#38bdf8" },
  
  // Blues
  { name: "Blue", value: "#3b82f6" },
  { name: "Dark Blue", value: "#2563eb" },
  { name: "Light Blue", value: "#60a5fa" },
  
  // Indigos & Violets
  { name: "Indigo", value: "#6366f1" },
  { name: "Dark Indigo", value: "#4f46e5" },
  { name: "Light Indigo", value: "#818cf8" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Dark Violet", value: "#7c3aed" },
  { name: "Light Violet", value: "#a78bfa" },
  
  // Purples & Fuchsias
  { name: "Purple", value: "#a855f7" },
  { name: "Dark Purple", value: "#9333ea" },
  { name: "Light Purple", value: "#c084fc" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Dark Fuchsia", value: "#c026d3" },
  { name: "Light Fuchsia", value: "#e879f9" },
  
  // Pinks
  { name: "Pink", value: "#ec4899" },
  { name: "Dark Pink", value: "#db2777" },
  { name: "Light Pink", value: "#f472b6" },
  
  // Browns, Stones & Grays
  { name: "Brown", value: "#92400e" },
  { name: "Stone", value: "#78716c" },
  { name: "Light Stone", value: "#a8a29e" },
  { name: "Slate", value: "#64748b" },
  { name: "Dark Slate", value: "#475569" },
  { name: "Light Slate", value: "#94a3b8" },
]

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(category.name)
  const [type, setType] = useState<string>(category.type)
  const [color, setColor] = useState(category.color)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    setName(category.name)
    setType(category.type)
    setColor(category.color)
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name,
          type: type as Category["type"],
          color,
        })
        .eq("id", category.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: option.value }}
                        />
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

