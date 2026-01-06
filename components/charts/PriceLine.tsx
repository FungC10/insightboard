'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { CHART_CONFIG } from '@/lib/constants'
import { TimeRange } from '@/lib/types'
import { movingAverage } from '@/lib/smooth'

interface PriceLineProps {
  data: { timestamp: number; price: number }[]
  height?: number
  range?: TimeRange
  symbol?: string
  color?: string
}

// Range-based smoothing windows
const rangeSmoothing: Record<TimeRange, number> = {
  '1D': 1,
  '7D': 3,
  '1M': 5,
  '1Y': 9,
}

// Coin-specific smoothing factors
const coinSmoothingFactor: Record<string, number> = {
  BTC: 1.4,
  ETH: 1.1,
  ADA: 0.9,
}

// Format timestamp based on range
function formatTimestamp(timestamp: number, range: TimeRange): string {
  const date = new Date(timestamp)

  switch (range) {
    case '1D':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    case '7D':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    case '1M':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    case '1Y':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    default:
      return date.toLocaleString()
  }
}

export default function PriceLine({
  data,
  height = CHART_CONFIG.defaultHeight,
  range = '1D',
  symbol = 'BTC',
  color = CHART_CONFIG.strokeColor,
}: PriceLineProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ height }}
      >
        <span className="text-gray-500">No data available</span>
      </div>
    )
  }

  // Calculate smoothing window based on range and coin
  const baseWindow = rangeSmoothing[range] || 1
  const smoothingFactor = coinSmoothingFactor[symbol] || 1
  const window = Math.round(baseWindow * smoothingFactor)

  // Apply smoothing for presentation only
  const displayData = movingAverage(data, window)

  // Calculate Y-axis domain with padding
  const prices = displayData.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const yDomain = [minPrice * 0.98, maxPrice * 1.02]

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={CHART_CONFIG.margins}>
          <defs>
            <linearGradient
              id={`gradient-${symbol}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            hide
          />
          <YAxis
            dataKey="price"
            type="number"
            domain={yDomain}
            hide
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              'Price',
            ]}
            labelFormatter={(label: number) => formatTimestamp(label, range)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={CHART_CONFIG.strokeWidth}
            fill={`url(#gradient-${symbol})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
