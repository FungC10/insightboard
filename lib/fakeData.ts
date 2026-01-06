import { Coin } from './types'

// Generate deterministic fake history data
function generateFakeHistory(
  basePrice: number,
  points: number = 100
): Array<{ timestamp: number; price: number }> {
  const history: Array<{ timestamp: number; price: number }> = []
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

// Fake coin data for local development
export const FAKE_COINS: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 43250.5,
    priceChange24h: 2.34,
    marketCap: 850000000000,
    totalVolume: 25000000000,
    history: generateFakeHistory(43250.5),
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 2650.75,
    priceChange24h: -1.23,
    marketCap: 320000000000,
    totalVolume: 15000000000,
    history: generateFakeHistory(2650.75),
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    currentPrice: 0.485,
    priceChange24h: 0.87,
    marketCap: 17000000000,
    totalVolume: 500000000,
    history: generateFakeHistory(0.485),
  },
]
