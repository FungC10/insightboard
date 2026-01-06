import { MarketState } from './types'

const MARKET_STATE_KEY = 'insightboard_market_state'

// Server-side in-memory cache (persists across API requests)
let serverMarketState: MarketState | null = null

// Initial base prices for coins
const INITIAL_BASE_PRICES: Record<string, number> = {
  bitcoin: 43250.5,
  ethereum: 2650.75,
  cardano: 0.485,
}

/**
 * Generate a pseudo-random seed from a string
 * This ensures deterministic randomness without Math.random()
 */
function generateSeedFromString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 1000000
}

/**
 * Generate seed from timestamp (deterministic but unique per time)
 */
function generateSeedFromTime(): number {
  const now = Date.now()
  // Use a combination of timestamp components for seed
  const seed = (now % 1000000) * 7 + Math.floor(now / 1000000) * 13
  return seed % 1000000
}

/**
 * Get or create market state
 * On server: Uses in-memory cache
 * On client: Uses localStorage (for future client-side features)
 */
export function getOrCreateMarketState(): MarketState {
  // Server-side: Use in-memory cache
  if (typeof window === 'undefined') {
    if (serverMarketState) {
      return serverMarketState
    }

    // Create new market state
    const seed = generateSeedFromTime()
    serverMarketState = {
      seed,
      startTime: Date.now(),
      basePrices: { ...INITIAL_BASE_PRICES },
    }

    return serverMarketState
  }

  // Client-side: Use localStorage
  try {
    const stored = localStorage.getItem(MARKET_STATE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as MarketState
      // Validate structure
      if (
        parsed.seed &&
        parsed.startTime &&
        parsed.basePrices &&
        typeof parsed.seed === 'number' &&
        typeof parsed.startTime === 'number'
      ) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load market state from localStorage:', error)
  }

  // Create new market state
  const seed = generateSeedFromTime()
  const newState: MarketState = {
    seed,
    startTime: Date.now(),
    basePrices: { ...INITIAL_BASE_PRICES },
  }

  try {
    localStorage.setItem(MARKET_STATE_KEY, JSON.stringify(newState))
  } catch (error) {
    console.warn('Failed to save market state to localStorage:', error)
  }

  return newState
}

/**
 * Reset market state (clears and regenerates)
 */
export function resetMarket(): MarketState {
  // Server-side
  if (typeof window === 'undefined') {
    const seed = generateSeedFromTime()
    serverMarketState = {
      seed,
      startTime: Date.now(),
      basePrices: { ...INITIAL_BASE_PRICES },
    }
    return serverMarketState
  }

  // Client-side
  const seed = generateSeedFromTime()
  const newState: MarketState = {
    seed,
    startTime: Date.now(),
    basePrices: { ...INITIAL_BASE_PRICES },
  }

  try {
    localStorage.setItem(MARKET_STATE_KEY, JSON.stringify(newState))
  } catch (error) {
    console.warn('Failed to save market state to localStorage:', error)
  }

  return newState
}
