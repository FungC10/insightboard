import { Coin, TimeRange } from './types'

// Range configuration
const RANGE_CONFIG: Record<
  TimeRange,
  { points: number; stepMs: number; volatility: number }
> = {
  '1D': { points: 96, stepMs: 15 * 60 * 1000, volatility: 0.015 }, // 15 min steps, low volatility
  '7D': { points: 168, stepMs: 60 * 60 * 1000, volatility: 0.025 }, // 1 hour steps, medium volatility
  '1M': { points: 120, stepMs: 6 * 60 * 60 * 1000, volatility: 0.04 }, // 6 hour steps, higher volatility
  '1Y': { points: 365, stepMs: 24 * 60 * 60 * 1000, volatility: 0.06 }, // 1 day steps, highest volatility
}

// Generate deterministic fake history data with seed and range
export function generateFakeHistory(
  basePrice: number,
  seed: number,
  range: TimeRange = '1D'
): Array<{ timestamp: number; price: number }> {
  const config = RANGE_CONFIG[range]
  const history: Array<{ timestamp: number; price: number }> = []
  const now = Date.now()

  // Phase offset based on seed - ensures different coins have different curve shapes
  const phase = seed * 0.37

  for (let i = 0; i < config.points; i++) {
    const timestamp = now - (config.points - i - 1) * config.stepMs

    // Variation depends on i, seed (via phase), and range (via volatility)
    // Multiple sine/cosine waves with different frequencies create realistic price movements
    const variation =
      (Math.sin(i * 0.1 + phase) +
        Math.cos(i * 0.15 + phase * 0.5) +
        Math.sin(i * 0.05 + phase * 1.2) * 0.5) *
      config.volatility

    const price = basePrice * (1 + variation)

    history.push({
      timestamp,
      price: Math.round(price * 100) / 100,
    })
  }

  return history
}

// Coin seeds for deterministic but distinct chart shapes
const COIN_SEEDS: Record<string, number> = {
  bitcoin: 1,
  ethereum: 2,
  cardano: 3,
}

// Base coin data (without history - generated on-demand)
interface BaseCoin {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChange24h: number
  marketCap: number
  totalVolume: number
}

const BASE_COINS: BaseCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 43250.5,
    priceChange24h: 2.34,
    marketCap: 850000000000,
    totalVolume: 25000000000,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 2650.75,
    priceChange24h: -1.23,
    marketCap: 320000000000,
    totalVolume: 15000000000,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    currentPrice: 0.485,
    priceChange24h: 0.87,
    marketCap: 17000000000,
    totalVolume: 500000000,
  },
]

// Generate coins with history for a specific range
export function getFakeCoins(ids: string[], range: TimeRange = '1D'): Coin[] {
  return BASE_COINS.filter(coin => ids.includes(coin.id)).map(coin => ({
    ...coin,
    history: generateFakeHistory(
      coin.currentPrice,
      COIN_SEEDS[coin.id] || 1,
      range
    ),
  }))
}
