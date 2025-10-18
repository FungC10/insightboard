// Core data types for InsightBoard
export interface Coin {
  id: string
  symbol: string
  price: number
  change24h: number
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
