import { useQuery } from '@tanstack/react-query'
import { Coin } from './types'

async function fetchCoins(ids: string[]): Promise<Coin[]> {
  const params = new URLSearchParams({ ids: ids.join(',') })
  const response = await fetch(`/api/coins?${params}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.coins
}

export function useCoins(ids: string[]) {
  return useQuery({
    queryKey: ['coins', ids],
    queryFn: () => fetchCoins(ids),
    enabled: ids.length > 0,
  })
}
