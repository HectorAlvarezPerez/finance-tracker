import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { HoldingsList } from "@/components/portfolio/holdings-list"
import { AddHoldingDialog } from "@/components/portfolio/add-holding-dialog"

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const supabase = await createServerClient()
  const t = await getTranslations('portfolio')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: holdings } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", user.id)
    .order("asset_symbol")

  // Get latest manual prices for each holding
  const pricesMap = new Map<string, number>()
  if (holdings && holdings.length > 0) {
    for (const holding of holdings) {
      const manualSymbol = `manual_${holding.id}`
      const { data: priceData } = await supabase
        .from("prices")
        .select("*")
        .eq("asset_symbol", manualSymbol)
        .eq("user_id", user.id)
        .order("as_of", { ascending: false })
        .limit(1)

      if (priceData && priceData.length > 0) {
        pricesMap.set(manualSymbol, parseFloat(priceData[0].price.toString()))
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

