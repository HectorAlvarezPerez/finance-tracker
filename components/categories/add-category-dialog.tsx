"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

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

export function AddCategoryDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<string>("expense")
  const [color, setColor] = useState("#ef4444")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations("dialogs.addCategory")
  const tForms = useTranslations("forms")
  const tMsg = useTranslations("messages")
  const tTypes = useTranslations("categoryTypes")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("categories").insert({
        user_id: userId,
        name,
        type,
        color,
        icon: "tag",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      setOpen(false)
      setName("")
      setType("expense")
      setColor("#ef4444")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your transactions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Coffee Shops"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
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
              <Label htmlFor="color">Color</Label>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
