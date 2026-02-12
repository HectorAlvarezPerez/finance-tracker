import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { HoldingsList } from "@/components/portfolio/holdings-list"
import { AddHoldingDialog } from "@/components/portfolio/add-holding-dialog"
import type { Database } from "@/types/database"

export const dynamic = 'force-dynamic'

type Holding = Database["public"]["Tables"]["holdings"]["Row"]

export default async function PortfolioPage() {
  const supabase = await createServerClient()
  const t = await getTranslations('portfolio')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Apply due weekly/monthly recurring quantities before loading holdings.
  const { error: recurringApplyError } = await supabase.rpc("apply_portfolio_recurring_quantities", {
    target_user_id: user.id,
  })

  if (
    recurringApplyError &&
    recurringApplyError.code !== "PGRST202" &&
    recurringApplyError.code !== "42883"
  ) {
    console.error("Failed to apply recurring holding quantities:", recurringApplyError)
  }

  const { data: holdings } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", user.id)
    .order("asset_symbol")

  // Get latest manual prices with a single query and map the newest entry per holding.
  const pricesMap = new Map<string, number>()
  if (holdings && holdings.length > 0) {
    const manualSymbols = holdings.map((holding: Holding) => `manual_${holding.id}`)

    const { data: priceRows } = await supabase
      .from("prices")
      .select("asset_symbol, price, as_of")
      .eq("user_id", user.id)
      .in("asset_symbol", manualSymbols)
      .order("as_of", { ascending: false })

    if (priceRows) {
      for (const row of priceRows) {
        if (!pricesMap.has(row.asset_symbol)) {
          pricesMap.set(row.asset_symbol, parseFloat(row.price.toString()))
        }
      }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <AddHoldingDialog userId={user.id} />
        </div>
      </div>

      <PortfolioOverview holdings={holdings || []} prices={pricesMap} />

      <HoldingsList holdings={holdings || []} prices={pricesMap} userId={user.id} />
    </div>
  )
}
