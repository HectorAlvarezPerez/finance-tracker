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
import { AlertTriangle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import type { Database } from "@/types/database"

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export function DeleteHoldingDialog({
  holding,
  open,
  onOpenChange,
}: {
  holding: Holding
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("portfolio")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const holdingLabel = holding.asset_symbol || holding.asset_name

  const handleDelete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.from("holdings").delete().eq("id", holding.id)

      if (error) throw error

      toast({
        title: t("success"),
        description: t("deleteHoldingSuccess", { symbol: holdingLabel }),
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedDeleteHolding"),
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
            {t("deleteHoldingTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteHoldingDescription", { symbol: holdingLabel })}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{t("deleteHoldingWarning")}</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>
              {t("deleteUnitsLine", {
                quantity: holding.quantity.toFixed(8).replace(/\.?0+$/, ""),
                symbol: holdingLabel,
              })}
            </li>
            <li>{t("deletePriceHistoryLine")}</li>
            <li>{t("deleteTradesLine")}</li>
          </ul>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? t("deleting") : t("deleteHolding")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
