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
} from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/database"
import { AlertTriangle } from "lucide-react"

type Account = Database["public"]["Tables"]["accounts"]["Row"]

export function DeleteAccountDialog({
  account,
  open,
  onOpenChange,
}: {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('dialogs.deleteAccount')
  const tForms = useTranslations('forms')
  const tMsg = useTranslations('messages')

  const handleDelete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.from("accounts").delete().eq("id", account.id)

      if (error) throw error

      toast({
        title: tMsg('success'),
        description: t('message'),
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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('message')} &quot;{account.name}&quot;?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tForms('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? tForms('deleting') : t('title')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

