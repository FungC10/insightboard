'use client'

import { useCoins } from '@/lib/useCoins'
import PriceLine from '@/components/charts/PriceLine'

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-48 bg-gray-300 rounded"></div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: coins, isLoading, error } = useCoins(['bitcoin', 'ethereum'])

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>
        <div className="space-y-4">
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>
        <div className="text-red-500">
          Error loading data: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>
      <div className="space-y-6">
        {coins?.map((coin) => {
          const chartData = coin.history.map(point => ({
            t: point.timestamp,
            p: point.price
          }))
          
          return (
            <div key={coin.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">
                {coin.symbol} - ${coin.price.toFixed(2)}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                24h Change: {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
              </p>
              <PriceLine data={chartData} height={200} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
