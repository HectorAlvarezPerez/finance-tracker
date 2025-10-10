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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, Sparkles } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import Papa from "papaparse"
import type { Database } from "@/types/database"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export function SmartCSVImportDialog({
  userId,
  accounts,
  categories,
}: {
  userId: string
  accounts: Account[]
  categories: Category[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('transactions')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      // Check if it's a CSV or Excel file
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setFile(file)
      } else {
        toast({
          title: "Formato no válido",
          description: "Por favor sube un archivo CSV o Excel (.csv, .xlsx, .xls)",
          variant: "destructive",
        })
      }
    }
  }

  // Detect column names flexibly
  const detectColumns = (headers: string[]) => {
    const lowerHeaders = headers.map(h => h.toLowerCase())
    
    const dateCol = headers[lowerHeaders.findIndex(h => 
      h.includes('date') || h.includes('fecha') || h.includes('data')
    )]
    
    const descCol = headers[lowerHeaders.findIndex(h => 
      h.includes('desc') || h.includes('concept') || h.includes('detail') || 
      h.includes('name') || h.includes('merchant')
    )]
    
    const amountCol = headers[lowerHeaders.findIndex(h => 
      h.includes('amount') || h.includes('value') || h.includes('import') || 
      h.includes('cantidad') || h.includes('monto')
    )]

    return { dateCol, descCol, amountCol }
  }

  // Parse amount flexibly (handles different formats)
  const parseAmount = (value: string): number => {
    if (!value) return 0
    // Remove currency symbols, spaces, and replace comma with dot
    const cleaned = value
      .toString()
      .replace(/[€$£¥\s]/g, '')
      .replace(',', '.')
    return parseFloat(cleaned) || 0
  }

  const handleImport = async () => {
    if (!file) return

    // Validate that user has at least one account
    if (!accounts || accounts.length === 0) {
      toast({
        title: "Error",
        description: "Necesitas crear al menos una cuenta antes de importar transacciones.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress(10)
    setStatusMessage("Leyendo archivo...")

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const rows = results.data.filter((row: any) => {
            const values = Object.values(row).join('')
            return values.trim().length > 0
          })

          if (rows.length === 0) {
            throw new Error("No se encontraron datos válidos en el archivo")
          }

          setProgress(20)
          setStatusMessage(`Procesando ${rows.length} transacciones...`)

          // Detect columns automatically
          const headers = Object.keys(rows[0] as any)
          const { dateCol, descCol, amountCol } = detectColumns(headers)

          if (!dateCol || !descCol || !amountCol) {
            throw new Error("No se pudieron detectar las columnas necesarias (fecha, descripción, cantidad)")
          }

          // Prepare transactions for AI analysis
          const rawTransactions = rows.map((row: any) => ({
            date: row[dateCol],
            description: row[descCol],
            amount: parseAmount(row[amountCol]),
          }))

          setProgress(40)
          setStatusMessage("Analizando transacciones con IA...")

          // Call AI to categorize transactions
          const aiResponse = await fetch('/api/ai-categorize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactions: rawTransactions,
              userId,
            }),
          })

          if (!aiResponse.ok) {
            throw new Error('Error al categorizar con IA')
          }

          const { categorizations } = await aiResponse.json()

          setProgress(60)
          setStatusMessage("Creando categorías necesarias...")

          // Create missing categories
          const existingCategoryNames = new Set(categories.map(c => c.name.toLowerCase()))
          const newCategories = new Map<string, { name: string; type: 'income' | 'expense' }>()

          categorizations.forEach((cat: any) => {
            const categoryName = cat.category
            if (!existingCategoryNames.has(categoryName.toLowerCase()) && 
                !newCategories.has(categoryName.toLowerCase())) {
              newCategories.set(categoryName.toLowerCase(), {
                name: categoryName,
                type: cat.type,
              })
            }
          })

          // Insert new categories
          const categoryMap = new Map<string, string>()
          categories.forEach(c => categoryMap.set(c.name.toLowerCase(), c.id))

          if (newCategories.size > 0) {
            const categoriesToInsert = Array.from(newCategories.values()).map(nc => ({
              user_id: userId,
              name: nc.name,
              type: nc.type,
              color: generateColor(),
            }))

            const { data: insertedCategories, error: catError } = await supabase
              .from('categories')
              .insert(categoriesToInsert as any)
              .select()

            if (catError) throw catError

            insertedCategories?.forEach(c => {
              categoryMap.set(c.name.toLowerCase(), c.id)
            })
          }

          setProgress(80)
          setStatusMessage("Guardando transacciones...")

          // Prepare final transactions
          const transactions = rawTransactions.map((t: any, i: number) => {
            const cat = categorizations[i]
            const categoryId = categoryMap.get(cat.category.toLowerCase()) || null
            
            // Determine amount sign based on type
            let amount = Math.abs(t.amount)
            if (cat.type === 'expense') {
              amount = -amount
            }

            return {
              user_id: userId,
              account_id: accounts[0]?.id || "",
              date: t.date,
              description: t.description,
              amount,
              category_id: categoryId,
              status: "posted" as const,
              notes: null,
            }
          })

          // Insert transactions
          const { error: txError } = await supabase
            .from('transactions')
            .insert(transactions as any)

          if (txError) throw txError

          setProgress(100)
          setStatusMessage("¡Completado!")

          toast({
            title: "✨ Importación inteligente completada",
            description: `${transactions.length} transacciones importadas y categorizadas${newCategories.size > 0 ? `, ${newCategories.size} categorías creadas` : ''}`,
          })

          setOpen(false)
          router.refresh()
          
          // Reset after close
          setTimeout(() => {
            setFile(null)
            setProgress(0)
            setStatusMessage("")
          }, 500)
        },
        error: (error: any) => {
          throw new Error(`Error al leer el archivo: ${error.message}`)
        },
      })
    } catch (error: any) {
      console.error('Import error:', error)
      toast({
        title: "Error",
        description: error.message || "Error al importar transacciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate random color for new categories
  const generateColor = () => {
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
      "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
      "#a855f7", "#ec4899", "#f43f5e"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          Smart Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Importación Inteligente
          </DialogTitle>
          <DialogDescription>
            Sube un CSV o Excel. La IA detectará automáticamente categorías y creará las que falten.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
              }
              ${loading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              id="csv-file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className={`p-3 rounded-full transition-all ${
                isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted'
              }`}>
                <Upload className={`h-8 w-8 ${isDragging ? 'animate-bounce' : ''}`} />
              </div>
              
              <div>
                <p className="text-sm font-medium">
                  {isDragging 
                    ? '¡Suelta el archivo aquí!' 
                    : 'Arrastra tu CSV/Excel aquí'
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  o haz click para seleccionar
                </p>
              </div>
              
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">CSV</span>
                <span className="px-2 py-1 bg-muted rounded">XLSX</span>
                <span className="px-2 py-1 bg-muted rounded">XLS</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ✨ Detección automática de columnas • IA categoriza transacciones • Crea categorías que falten
          </p>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
            </div>
          )}

          {file && !loading && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-bounce" />
                Procesando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Importar con IA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

