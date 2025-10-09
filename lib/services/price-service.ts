// PriceService: Abstract interface for getting asset prices
// Supports both manual entry and future API integration

export interface PriceData {
  price: number
  asOf: Date
  currency: string
  source: "manual" | "api"
}

export interface IPriceService {
  getPrice(symbol: string, userId?: string): Promise<PriceData | null>
  setPrice(symbol: string, price: number, userId: string, currency?: string): Promise<void>
  getHistoricalPrices(
    symbol: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<PriceData[]>
}

// Manual Price Service Implementation (default)
export class ManualPriceService implements IPriceService {
  constructor(private supabaseClient: any) {}

  async getPrice(symbol: string, userId?: string): Promise<PriceData | null> {
    const query = this.supabaseClient
      .from("prices")
      .select("*")
      .eq("asset_symbol", symbol)
      .order("as_of", { ascending: false })
      .limit(1)

    if (userId) {
      query.or(`user_id.eq.${userId},user_id.is.null`)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return null
    }

    return {
      price: parseFloat(data[0].price),
      asOf: new Date(data[0].as_of),
      currency: data[0].currency,
      source: data[0].source,
    }
  }

  async setPrice(
    symbol: string,
    price: number,
    userId: string,
    currency: string = "USD"
  ): Promise<void> {
    const { error } = await this.supabaseClient.from("prices").insert({
      asset_symbol: symbol,
      price,
      currency,
      user_id: userId,
      source: "manual",
      as_of: new Date().toISOString(),
    })

    if (error) {
      throw new Error(`Failed to set price: ${error.message}`)
    }
  }

  async getHistoricalPrices(
    symbol: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<PriceData[]> {
    const query = this.supabaseClient
      .from("prices")
      .select("*")
      .eq("asset_symbol", symbol)
      .gte("as_of", startDate.toISOString())
      .lte("as_of", endDate.toISOString())
      .order("as_of", { ascending: true })

    if (userId) {
      query.or(`user_id.eq.${userId},user_id.is.null`)
    }

    const { data, error } = await query

    if (error || !data) {
      return []
    }

    return data.map((row: any) => ({
      price: parseFloat(row.price),
      asOf: new Date(row.as_of),
      currency: row.currency,
      source: row.source,
    }))
  }
}

// API Price Service Implementation (future - with feature flag)
export class APIPriceService implements IPriceService {
  constructor(
    private supabaseClient: any,
    private apiKey?: string
  ) {}

  async getPrice(symbol: string, userId?: string): Promise<PriceData | null> {
    // First check manual prices
    const manualService = new ManualPriceService(this.supabaseClient)
    const manualPrice = await manualService.getPrice(symbol, userId)

    // If feature flag is disabled, return manual price
    if (process.env.NEXT_PUBLIC_ENABLE_REALTIME_PRICES !== "true") {
      return manualPrice
    }

    // TODO: Implement API call to external price service
    // For now, fall back to manual
    return manualPrice
  }

  async setPrice(
    symbol: string,
    price: number,
    userId: string,
    currency: string = "USD"
  ): Promise<void> {
    const manualService = new ManualPriceService(this.supabaseClient)
    return manualService.setPrice(symbol, price, userId, currency)
  }

  async getHistoricalPrices(
    symbol: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<PriceData[]> {
    const manualService = new ManualPriceService(this.supabaseClient)
    return manualService.getHistoricalPrices(symbol, startDate, endDate, userId)
  }
}

// Factory function to create the appropriate service
export function createPriceService(supabaseClient: any): IPriceService {
  const useAPI = process.env.NEXT_PUBLIC_ENABLE_REALTIME_PRICES === "true"

  if (useAPI) {
    return new APIPriceService(supabaseClient, process.env.PRICE_API_KEY)
  }

  return new ManualPriceService(supabaseClient)
}

