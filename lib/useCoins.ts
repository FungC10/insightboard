import { useQuery } from '@tanstack/react-query'
import { Coin } from './types'
import { fetchCoins } from './fetcher'

export function useCoins(ids: string[]) {
  return useQuery({
    queryKey: ['coins', ids],
    queryFn: () => fetchCoins(ids),
    enabled: ids.length > 0,
  })
}
