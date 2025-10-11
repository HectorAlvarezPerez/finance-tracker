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

export function AddAccountDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<string>("checking")
  const [currency, setCurrency] = useState("EUR")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('dialogs.addAccount')
  const tForms = useTranslations('forms')
  const tMsg = useTranslations('messages')
  const tTypes = useTranslations('accountTypes')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("accounts").insert({
        user_id: userId,
        name,
        type,
        currency,
        is_active: true,
      })

      if (error) throw error

      toast({
        title: tMsg('success'),
        description: t('subtitle'),
      })

      setOpen(false)
      setName("")
      setType("checking")
      router.refresh()
    } catch (error: any) {
      toast({
        title: tMsg('error'),
        description: error.message || tMsg('error'),
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
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>
              {t('subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tForms('name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{tForms('type')}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">{tTypes('checking')}</SelectItem>
                  <SelectItem value="savings">{tTypes('savings')}</SelectItem>
                  <SelectItem value="brokerage">{tTypes('brokerage')}</SelectItem>
                  <SelectItem value="crypto">{tTypes('crypto')}</SelectItem>
                  <SelectItem value="other">{tTypes('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{tForms('currency')}</Label>
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                <span className="text-sm">EUR 🇪🇺</span>
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {tForms('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tForms('creating') : tForms('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

