'use client'

import { useCoins } from '@/lib/useCoins'
import PriceLine from '@/components/charts/PriceLine'
import StatCard from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function DashboardClient() {
  const { data: coins, isLoading, error } = useCoins(['bitcoin', 'ethereum'])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Error loading market data</p>
          </div>
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Failed to load data
                </h3>
                <p className="text-red-600">
                  Please try refreshing the page or check your connection.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const bitcoin = coins?.find(coin => coin.id === 'bitcoin')
  const ethereum = coins?.find(coin => coin.id === 'ethereum')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Market
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time cryptocurrency market data, advanced analytics, and
            professional-grade insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group">
            <StatCard
              title="Total Market Cap"
              value="$2.1T"
              delta={5.2}
              trend="up"
            />
          </div>
          <div className="group">
            <StatCard
              title="24h Volume"
              value="$89.2B"
              delta={-2.1}
              trend="down"
            />
          </div>
          <div className="group">
            <StatCard
              title="Active Cryptos"
              value="8,945"
              delta={12.5}
              trend="up"
            />
          </div>
          <div className="group">
            <StatCard
              title="Fear & Greed Index"
              value="68"
              delta={3.2}
              trend="up"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {bitcoin && (
            <div className="group">
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-orange-100 font-bold text-xl">
                        ₿
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Bitcoin
                      </h3>
                      <p className="text-gray-500 font-medium">BTC</p>
                    </div>
                  </div>
                  <Badge
                    variant={bitcoin.priceChange24h >= 0 ? 'success' : 'danger'}
                    className="text-lg px-4 py-2"
                  >
                    {bitcoin.priceChange24h >= 0 ? '+' : ''}
                    {bitcoin.priceChange24h.toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  ${bitcoin.currentPrice.toLocaleString()}
                </div>
                <div className="h-80 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
                  <PriceLine data={bitcoin.history} height={320} />
                </div>
              </Card>
            </div>
          )}

          {ethereum && (
            <div className="group">
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-blue-100 font-bold text-xl">Ξ</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Ethereum
                      </h3>
                      <p className="text-gray-500 font-medium">ETH</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      ethereum.priceChange24h >= 0 ? 'success' : 'danger'
                    }
                    className="text-lg px-4 py-2"
                  >
                    {ethereum.priceChange24h >= 0 ? '+' : ''}
                    {ethereum.priceChange24h.toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  ${ethereum.currentPrice.toLocaleString()}
                </div>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                  <PriceLine data={ethereum.history} height={320} />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Market Overview */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Market Overview
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live Data
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">
                    Coin
                  </th>
                  <th className="text-right py-4 px-6 font-bold text-gray-700 text-lg">
                    Price
                  </th>
                  <th className="text-right py-4 px-6 font-bold text-gray-700 text-lg">
                    24h Change
                  </th>
                  <th className="text-right py-4 px-6 font-bold text-gray-700 text-lg">
                    Market Cap
                  </th>
                  <th className="text-right py-4 px-6 font-bold text-gray-700 text-lg">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {coins?.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <span className="text-gray-600 font-bold text-lg">
                            {coin.symbol.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {coin.name}
                          </div>
                          <div className="text-gray-500 font-medium">
                            {coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-6 px-6 font-bold text-gray-900 text-lg">
                      ${coin.currentPrice.toLocaleString()}
                    </td>
                    <td className="text-right py-6 px-6">
                      <Badge
                        variant={
                          coin.priceChange24h >= 0 ? 'success' : 'danger'
                        }
                        className="text-base px-4 py-2"
                      >
                        {coin.priceChange24h >= 0 ? '+' : ''}
                        {coin.priceChange24h.toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="text-right py-6 px-6 font-bold text-gray-900 text-lg">
                      ${coin.marketCap.toLocaleString()}
                    </td>
                    <td className="text-right py-6 px-6 font-bold text-gray-900 text-lg">
                      ${coin.totalVolume.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
