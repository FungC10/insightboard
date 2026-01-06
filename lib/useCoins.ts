import { useQuery } from '@tanstack/react-query'
import { Coin, TimeRange } from './types'
import { fetchCoins } from './fetcher'

export function useCoins(ids: string[], range: TimeRange = '1D') {
  return useQuery({
    queryKey: ['coins', ids, range],
    queryFn: () => fetchCoins(ids, range),
    enabled: ids.length > 0,
  })
}
