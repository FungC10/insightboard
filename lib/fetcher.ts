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

// Real provider implementation with rate limiting
async function providerFetchCoins(ids: string[]): Promise<Coin[]> {
  const apiKey = process.env.PROVIDER_API_KEY
  if (!apiKey) {
    throw new Error('PROVIDER_API_KEY not configured')
  }

  const baseUrl = 'https://api.coingecko.com/api/v3'
  const idsParam = ids.join(',')
  
  // Fetch current prices
  const pricesResponse = await fetchWithBackoff(
    `${baseUrl}/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`,
    { headers: { 'x-cg-demo-api-key': apiKey } }
  )
  
  const prices = await pricesResponse.json()
  
  // Fetch historical data for each coin
  const coins: Coin[] = []
  for (const id of ids) {
    const priceData = prices[id]
    if (!priceData) continue
    
    // Get 30 days of hourly data
    const historyResponse = await fetchWithBackoff(
      `${baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=hourly`,
      { headers: { 'x-cg-demo-api-key': apiKey } }
    )
    
    const historyData = await historyResponse.json()
    const history: CoinHistoryPoint[] = historyData.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price
    }))
    
    coins.push({
      id,
      symbol: id.toUpperCase(),
      price: priceData.usd,
      change24h: priceData.usd_24h_change || 0,
      history
    })
  }
  
  return coins
}

// Simple backoff retry for rate limiting
async function fetchWithBackoff(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    const response = await fetch(url, options)
    
    if (response.status === 429 && retries > 0) {
      // Rate limited - wait and retry
      await new Promise(resolve => setTimeout(resolve, 500))
      return fetchWithBackoff(url, options, retries - 1)
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return fetchWithBackoff(url, options, retries - 1)
    }
    throw error
  }
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
