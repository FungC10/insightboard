import { Coin } from './types'
import { CoinsResponseSchema } from './zod'

/**
 * Fetches coin data from the /api/coins endpoint
 * This is the single source of data access for the application
 */
export async function fetchCoins(ids: string[]): Promise<Coin[]> {
  if (ids.length === 0) {
    return []
  }

  const idsParam = ids.join(',')
  const response = await fetch(`/api/coins?ids=${idsParam}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  const validatedResponse = CoinsResponseSchema.parse(data)

  return validatedResponse.coins
}
