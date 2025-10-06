import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { HoldingsList } from "@/components/portfolio/holdings-list"
import { AddHoldingDialog } from "@/components/portfolio/add-holding-dialog"
import { ManagePricesDialog } from "@/components/portfolio/manage-prices-dialog"

export default async function PortfolioPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: holdings } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", session.user.id)
    .order("asset_symbol")

  // Get latest prices for each asset
  const pricesMap = new Map<string, number>()
  if (holdings && holdings.length > 0) {
    for (const holding of holdings) {
      const { data: priceData } = await supabase
        .from("prices")
        .select("*")
        .eq("asset_symbol", holding.asset_symbol)
        .or(`user_id.eq.${session.user.id},user_id.is.null`)
        .order("as_of", { ascending: false })
        .limit(1)

      if (priceData && priceData.length > 0) {
        pricesMap.set(holding.asset_symbol, parseFloat(priceData[0].price.toString()))
      }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investments and performance
          </p>
        </div>
        <div className="flex gap-2">
          <ManagePricesDialog userId={session.user.id} holdings={holdings || []} />
          <AddHoldingDialog userId={session.user.id} />
        </div>
      </div>

      <PortfolioOverview holdings={holdings || []} prices={pricesMap} />

      <HoldingsList holdings={holdings || []} prices={pricesMap} userId={session.user.id} />
    </div>
  )
}

