// Time range types
export type TimeRange = '1D' | '7D' | '1M' | '1Y'

// Market state for persistent pseudo-random simulation
export interface MarketState {
  seed: number
  startTime: number
  basePrices: Record<string, number>
}

// Core data types for InsightBoard
export interface Coin {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChange24h: number
  marketCap: number
  totalVolume: number
  history: CoinHistoryPoint[]
}

export interface CoinHistoryPoint {
  timestamp: number
  price: number
}

// API response types
export interface CoinsResponse {
  coins: Coin[]
}

// Provider types (for external API integration)
export interface ProviderCoin {
  id: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
}

export interface ProviderCoinHistory {
  prices: [number, number][]
}
