"use client"

import { useState, useEffect } from "react"
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

type Account = Database["public"]["Tables"]["accounts"]["Row"]

export function EditAccountDialog({
  account,
  open,
  onOpenChange,
}: {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(account.name)
  const [type, setType] = useState<string>(account.type)
  const [currency, setCurrency] = useState(account.currency)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('dialogs.editAccount')
  const tForms = useTranslations('forms')
  const tMsg = useTranslations('messages')
  const tTypes = useTranslations('accountTypes')

  useEffect(() => {
    setName(account.name)
    setType(account.type)
    setCurrency(account.currency)
  }, [account])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          name,
          type: type as Account["type"],
          currency,
        })
        .eq("id", account.id)

      if (error) throw error

      toast({
        title: tMsg('success'),
        description: t('subtitle'),
      })

      onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('subtitle')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{tForms('name')}</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">{tForms('type')}</Label>
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
              <Label htmlFor="edit-currency">{tForms('currency')}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tForms('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tForms('updating') : tForms('update')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

