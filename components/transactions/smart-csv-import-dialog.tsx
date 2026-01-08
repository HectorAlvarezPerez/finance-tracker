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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [useAICategorization, setUseAICategorization] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('dialogs.importCSV')
  const tForms = useTranslations('forms')
  const tMessages = useTranslations('messages')

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
          title: t('invalidFormat'),
          description: t('invalidFormatDesc'),
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

  // Parse date flexibly (handles different formats)
  const parseDate = (value: string): string => {
    if (!value) return new Date().toISOString().split('T')[0]

    const str = value.toString().trim()

    // Try different date formats
    // Format: YYYY-MM-DD (ISO)
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      return str.split(' ')[0] // Remove time if present
    }

    // Format: DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    // Format: MM/DD/YYYY or MM-DD-YYYY (American)
    const mmddyyyy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
    if (mmddyyyy) {
      const [, month, day, year] = mmddyyyy
      // Assume European format if day > 12, otherwise American
      if (parseInt(day) > 12) {
        return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`
      }
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    // Try parsing as Date object
    const date = new Date(str)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }

    // Fallback to today
    return new Date().toISOString().split('T')[0]
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
        title: t('error'),
        description: "You need to create at least one account first",
        variant: "destructive",
      })
      return
    }

    // Validate that user has selected an account
    if (!selectedAccountId) {
      toast({
        title: t('error'),
        description: "Please select an account for these transactions",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress(10)
    setStatusMessage(t('reading'))

    try {
      // Wrap Papa.parse in a Promise for better async handling
      const parseFile = (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              const rows = results.data.filter((row: any) => {
                const values = Object.values(row).join('')
                return values.trim().length > 0
              })
              resolve(rows)
            },
            error: (error: any) => {
              reject(error)
            },
          })
        })
      }

      const rows = await parseFile()

      if (rows.length === 0) {
        throw new Error(t('errorDesc'))
      }

      setProgress(20)
      setStatusMessage(t('processing'))

      // Detect columns automatically
      const headers = Object.keys(rows[0] as any)
      const { dateCol, descCol, amountCol } = detectColumns(headers)

      if (!dateCol || !descCol || !amountCol) {
        throw new Error(t('errorDesc'))
      }

      // Prepare transactions
      setProgress(40)
      setStatusMessage(t('preparing'))

      let transactions = rows.map((row: any) => ({
        user_id: userId,
        account_id: selectedAccountId,
        date: parseDate(row[dateCol]),
        description: row[descCol],
        amount: parseAmount(row[amountCol]),
        category_id: null, // No category assigned yet
        notes: null,
      }))

      // AI Categorization if enabled
      if (useAICategorization && categories.length > 0) {
        setProgress(50)
        setStatusMessage('Categorizando con IA...')

        try {
          const response = await fetch('/api/ai-categorize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactions: transactions.map(t => ({
                description: t.description,
                amount: t.amount,
              })),
              userId,
            }),
          })

          if (!response.ok) {
            throw new Error('Error al categorizar con IA')
          }

          const { categorizations } = await response.json()

          // Apply categorizations to transactions
          transactions = transactions.map((t, index) => {
            const categorization = categorizations.find((c: any) => c.index === index)
            return {
              ...t,
              category_id: categorization?.categoryId || null,
            }
          })

          const categorizedCount = transactions.filter(t => t.category_id !== null).length
          console.log(`✅ ${categorizedCount} de ${transactions.length} transacciones categorizadas`)
        } catch (error) {
          console.error('Error en categorización con IA:', error)
          // Continue without categorization if AI fails
          toast({
            title: 'Aviso',
            description: 'No se pudo categorizar con IA. Las transacciones se importarán sin categoría.',
            variant: 'default',
          })
        }
      }

      setProgress(80)
      setStatusMessage(t('saving'))

      // Insert transactions
      const { error: txError } = await supabase
        .from('transactions')
        .insert(transactions as any)

      if (txError) throw txError

      setProgress(100)
      setStatusMessage(t('complete'))

      const categorizedCount = transactions.filter(t => t.category_id !== null).length
      const successMessage = useAICategorization && categorizedCount > 0
        ? `${transactions.length} transacciones importadas (${categorizedCount} categorizadas con IA)`
        : `${transactions.length} ${t('successDesc')}`

      toast({
        title: t('success'),
        description: successMessage,
      })

      setOpen(false)
      router.refresh()

      // Reset after close
      setTimeout(() => {
        setFile(null)
        setSelectedAccountId("")
        setUseAICategorization(true)
        setProgress(0)
        setStatusMessage("")
      }, 500)
    } catch (error: any) {
      console.error('Import error:', error)
      toast({
        title: t('error'),
        description: error.message || t('errorDesc'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          {tForms('import')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('subtitle')}
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
              <div className={`p-3 rounded-full transition-all ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted'
                }`}>
                <Upload className={`h-8 w-8 ${isDragging ? 'animate-bounce' : ''}`} />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {isDragging
                    ? t('dropHere')
                    : t('dragDrop')
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('orClick')}
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
            {t('fileInfo')}
          </p>

          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="account">{tForms('account')}</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger>
                <SelectValue placeholder={tForms('selectAccount')} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('accountAssignment')}
            </p>
          </div>

          {/* AI Categorization Toggle */}
          <div className="flex items-start space-x-3 rounded-lg border p-4 bg-primary/5">
            <Checkbox
              id="use-ai"
              checked={useAICategorization}
              onCheckedChange={(checked) => setUseAICategorization(checked as boolean)}
              disabled={loading || categories.length === 0}
            />
            <div className="flex-1 space-y-1">
              <label
                htmlFor="use-ai"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Categorizar automáticamente con IA
              </label>
              <p className="text-xs text-muted-foreground">
                {categories.length === 0
                  ? "Necesitas crear al menos una categoría primero"
                  : "Asignará automáticamente las transacciones a tus categorías existentes usando inteligencia artificial"
                }
              </p>
            </div>
          </div>

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
            disabled={!file || !selectedAccountId || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-bounce" />
                {t('processing')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t('importButton')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

