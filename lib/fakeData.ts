import { Coin, TimeRange, MarketState } from './types'

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

/**
 * Generate deterministic pseudo-random value from seed and time
 * No Math.random() - fully deterministic
 */
function pseudoRandom(seed: number, t: number): number {
  // Combine seed and time to create deterministic "random" value
  const combined = (seed * 9301 + t * 49297) % 233280
  return combined / 233280 // Normalize to 0-1
}

/**
 * Generate market history with time-based evolution
 * Prices evolve based on time elapsed since market start
 */
export function generateMarketHistory(
  basePrice: number,
  coinSeed: number,
  marketState: MarketState,
  range: TimeRange = '1D'
): Array<{ timestamp: number; price: number }> {
  const config = RANGE_CONFIG[range]
  const history: Array<{ timestamp: number; price: number }> = []
  const now = Date.now()

  // Time elapsed since market started (in hours for smoother calculations)
  const timeElapsed = (now - marketState.startTime) / (1000 * 60 * 60)

  // Phase offset based on coin seed - ensures different coins have different patterns
  const phase = coinSeed * 0.37

  // Market-wide seed affects overall trend
  const marketPhase = marketState.seed * 0.123

  for (let i = 0; i < config.points; i++) {
    const timestamp = now - (config.points - i - 1) * config.stepMs
    const pointTimeElapsed =
      (timestamp - marketState.startTime) / (1000 * 60 * 60)

    // Long-term trend (slow drift) - depends on time elapsed
    const trend =
      Math.sin(pointTimeElapsed * 0.01 + marketPhase) * 0.02 +
      Math.cos(pointTimeElapsed * 0.007 + marketPhase * 0.5) * 0.015

    // Volatility component (short-term fluctuations) - depends on point index and coin seed
    const volatility =
      (Math.sin(i * 0.1 + phase + pointTimeElapsed * 0.1) +
        Math.cos(i * 0.15 + phase * 0.5 + pointTimeElapsed * 0.08) +
        Math.sin(i * 0.05 + phase * 1.2 + pointTimeElapsed * 0.12) * 0.5) *
      config.volatility

    // Small deterministic noise based on seed and time
    const noise = (pseudoRandom(coinSeed, i + pointTimeElapsed) - 0.5) * 0.005

    // Combine all components
    const price = basePrice * (1 + trend + volatility + noise)

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

// Base coin metadata (without prices - prices come from market state)
interface BaseCoin {
  id: string
  symbol: string
  name: string
  marketCapMultiplier: number // Multiplier for market cap calculation
  volumeMultiplier: number // Multiplier for volume calculation
}

const BASE_COINS: BaseCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    marketCapMultiplier: 19650000, // Approximate circulating supply
    volumeMultiplier: 577500,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    marketCapMultiplier: 120200000,
    volumeMultiplier: 5660000,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    marketCapMultiplier: 35000000000,
    volumeMultiplier: 1030000000,
  },
]

/**
 * Calculate current price based on market state and time
 */
function calculateCurrentPrice(
  basePrice: number,
  coinSeed: number,
  marketState: MarketState
): number {
  const timeElapsed = (Date.now() - marketState.startTime) / (1000 * 60 * 60)
  const phase = coinSeed * 0.37
  const marketPhase = marketState.seed * 0.123

  const trend =
    Math.sin(timeElapsed * 0.01 + marketPhase) * 0.02 +
    Math.cos(timeElapsed * 0.007 + marketPhase * 0.5) * 0.015

  const volatility =
    (Math.sin(timeElapsed * 0.1 + phase) +
      Math.cos(timeElapsed * 0.08 + phase * 0.5)) *
    0.015

  const noise = (pseudoRandom(coinSeed, timeElapsed) - 0.5) * 0.005

  return basePrice * (1 + trend + volatility + noise)
}

/**
 * Calculate 24h price change
 */
function calculate24hChange(
  basePrice: number,
  coinSeed: number,
  marketState: MarketState
): number {
  const now = Date.now()
  const timeElapsed = (now - marketState.startTime) / (1000 * 60 * 60)
  const timeElapsed24h =
    (now - 24 * 60 * 60 * 1000 - marketState.startTime) / (1000 * 60 * 60)

  const currentPrice = calculateCurrentPrice(basePrice, coinSeed, marketState)

  const phase = coinSeed * 0.37
  const marketPhase = marketState.seed * 0.123

  const trend24h =
    Math.sin(timeElapsed24h * 0.01 + marketPhase) * 0.02 +
    Math.cos(timeElapsed24h * 0.007 + marketPhase * 0.5) * 0.015

  const volatility24h =
    (Math.sin(timeElapsed24h * 0.1 + phase) +
      Math.cos(timeElapsed24h * 0.08 + phase * 0.5)) *
    0.015

  const noise24h = (pseudoRandom(coinSeed, timeElapsed24h) - 0.5) * 0.005

  const price24h = basePrice * (1 + trend24h + volatility24h + noise24h)

  return ((currentPrice - price24h) / price24h) * 100
}

/**
 * Generate coins with market state-aware history and prices
 */
export function getFakeCoins(
  ids: string[],
  marketState: MarketState,
  range: TimeRange = '1D'
): Coin[] {
  return BASE_COINS.filter(coin => ids.includes(coin.id)).map(coin => {
    const basePrice = marketState.basePrices[coin.id] || 100
    const coinSeed = COIN_SEEDS[coin.id] || 1

    const currentPrice = calculateCurrentPrice(basePrice, coinSeed, marketState)
    const priceChange24h = calculate24hChange(basePrice, coinSeed, marketState)

    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      currentPrice: Math.round(currentPrice * 100) / 100,
      priceChange24h: Math.round(priceChange24h * 100) / 100,
      marketCap: Math.round(currentPrice * coin.marketCapMultiplier),
      totalVolume: Math.round(currentPrice * coin.volumeMultiplier),
      history: generateMarketHistory(basePrice, coinSeed, marketState, range),
    }
  })
}
