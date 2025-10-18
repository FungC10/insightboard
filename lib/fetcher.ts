import { Coin, CoinHistoryPoint } from './types'
import { CoinSchema } from './zod'

// Generate deterministic fake data for development
function generateFakeHistory(basePrice: number, points: number = 100): CoinHistoryPoint[] {
  const history: CoinHistoryPoint[] = []
  const now = Date.now()
  const stepMs = 5 * 60 * 1000 // 5 minutes

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i - 1) * stepMs
    // Add some realistic price variation (±2% max)
    const variation = (Math.sin(i * 0.1) + Math.cos(i * 0.15)) * 0.02
    const price = basePrice * (1 + variation)
    
    history.push({
      timestamp,
      price: Math.round(price * 100) / 100,
    })
  }

  return history
}

// Fake data for development
const FAKE_COINS: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    price: 43250.50,
    change24h: 2.34,
    history: generateFakeHistory(43250.50),
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    price: 2650.75,
    change24h: -1.23,
    history: generateFakeHistory(2650.75),
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    price: 0.485,
    change24h: 0.87,
    history: generateFakeHistory(0.485),
  },
]

// Temporary stub for real provider
async function providerFetchCoins(ids: string[]): Promise<Coin[]> {
  // This would call a real API like CoinGecko
  throw new Error('Provider not implemented yet')
}

// Main fetcher function
export async function getCoins(ids: string[]): Promise<Coin[]> {
  const useFakeData = process.env.USE_FAKE_DATA === '1'
  
  let coins: Coin[]
  
  if (useFakeData) {
    // Return fake data filtered by requested IDs
    coins = FAKE_COINS.filter(coin => ids.includes(coin.id))
  } else {
    // Call real provider
    coins = await providerFetchCoins(ids)
  }
  
  // Validate with Zod before returning
  const validatedCoins = coins.map(coin => CoinSchema.parse(coin))
  
  return validatedCoins
}
