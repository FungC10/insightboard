'use client'

import { useState } from 'react'
import { useCoins } from '@/lib/useCoins'
import PriceLine from '@/components/charts/PriceLine'
import StatCard from '@/components/ui/StatCard'
import { TIMEFRAME_MS } from '@/lib/constants'

type Timeframe = '24h' | '7d' | '30d'

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-48 bg-gray-300 rounded"></div>
    </div>
  )
}

function getTimeframeMs(timeframe: Timeframe): number {
  return TIMEFRAME_MS[timeframe]
}

function sliceDataByTimeframe(data: { t: number; p: number }[], timeframe: Timeframe) {
  const now = Date.now()
  const cutoff = now - getTimeframeMs(timeframe)
  return data.filter(point => point.t >= cutoff)
}

export default function DashboardClient() {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')
  const { data: coins, isLoading, error, refetch } = useCoins(['bitcoin', 'ethereum'])

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-medium">Failed to load data</h3>
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === tf
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {coins?.map((coin) => (
          <StatCard
            key={coin.id}
            title={coin.symbol}
            value={`$${coin.price.toFixed(2)}`}
            delta={coin.change24h}
          />
        ))}
      </div>
      <div className="space-y-6">
        {coins?.map((coin) => {
          const chartData = coin.history.map(point => ({
            t: point.timestamp,
            p: point.price
          }))
          const slicedData = sliceDataByTimeframe(chartData, timeframe)
          
          return (
            <div key={coin.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">
                {coin.symbol} Price Chart ({timeframe})
              </h2>
              <PriceLine data={slicedData} height={200} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
