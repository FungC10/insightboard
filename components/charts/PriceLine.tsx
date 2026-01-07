'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceDot,
} from 'recharts'
import { CHART_CONFIG } from '@/lib/constants'
import { TimeRange } from '@/lib/types'
import { movingAverage } from '@/lib/smooth'
import {
  formatPercentDelta,
  formatUsdDelta,
  formatUsdPrice,
} from '@/lib/format'
import { useEffect, useMemo, useState } from 'react'

interface PriceLineProps {
  data: { timestamp: number; price: number }[]
  height?: number
  range?: TimeRange
  symbol?: string
  color?: string
}

// Coin-specific smoothing factors
const coinSmoothingFactor: Record<string, number> = {
  BTC: 1.4,
  ETH: 1.1,
  ADA: 0.9,
}

// Time-based smoothing targets (how much time to "average over" for each range)
const rangeSmoothingMs: Record<TimeRange, number> = {
  '1D': 60 * 60 * 1000, // ~1 hour
  '7D': 12 * 60 * 60 * 1000, // ~12 hours
  '1M': 3 * 24 * 60 * 60 * 1000, // ~3 days
  '1Y': 30 * 24 * 60 * 60 * 1000, // ~30 days
}

function estimateStepMs(data: { timestamp: number; price: number }[]): number {
  if (!data || data.length < 2) return 1

  // Estimate from the first few deltas to avoid O(n) work and reduce impact of any outliers.
  const sampleCount = Math.min(20, data.length - 1)
  const deltas: number[] = []

  for (let i = 1; i <= sampleCount; i++) {
    const d = data[i].timestamp - data[i - 1].timestamp
    if (Number.isFinite(d) && d > 0) deltas.push(d)
  }

  if (deltas.length === 0) return 1
  deltas.sort((a, b) => a - b)
  return deltas[Math.floor(deltas.length / 2)]
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
  const [dragAnchor, setDragAnchor] = useState<{
    timestamp: number
    price: number
  } | null>(null)
  const [dragCurrent, setDragCurrent] = useState<{
    timestamp: number
    price: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function resetSelection() {
    setIsDragging(false)
    setDragAnchor(null)
    setDragCurrent(null)
  }

  // If the timeframe changes, cancel any active comparison selection.
  useEffect(() => {
    resetSelection()
  }, [range])

  const comparison = useMemo(() => {
    if (!dragAnchor || !dragCurrent) return null

    const older =
      dragAnchor.timestamp <= dragCurrent.timestamp ? dragAnchor : dragCurrent
    const newer =
      dragAnchor.timestamp <= dragCurrent.timestamp ? dragCurrent : dragAnchor

    const delta = newer.price - older.price
    const percent = older.price === 0 ? 0 : (delta / older.price) * 100

    const isUp = delta >= 0
    const stroke = isUp ? '#16a34a' : '#dc2626'
    const fill = isUp ? 'rgba(22, 163, 74, 0.14)' : 'rgba(220, 38, 38, 0.14)'

    return {
      older,
      newer,
      delta,
      percent,
      stroke,
      fill,
      isUp,
    }
  }, [dragAnchor, dragCurrent])

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

  // Calculate smoothing window based on time per point and coin
  const stepMs = estimateStepMs(data)
  const targetMs = rangeSmoothingMs[range] || 0
  const smoothingFactor = coinSmoothingFactor[symbol] || 1
  const rawWindow = Math.max(
    1,
    Math.round((targetMs / stepMs) * smoothingFactor)
  )
  const cappedWindow = Math.min(rawWindow, data.length)
  const window =
    cappedWindow % 2 === 0
      ? Math.min(cappedWindow + 1, data.length)
      : cappedWindow

  // Apply smoothing for presentation only
  const displayData = movingAverage(data, window)

  const chartData = comparison
    ? displayData.map(p => ({
        ...p,
        highlightPrice:
          p.timestamp >= comparison.older.timestamp &&
          p.timestamp <= comparison.newer.timestamp
            ? p.price
            : null,
      }))
    : displayData.map(p => ({ ...p, highlightPrice: null }))

  // Calculate Y-axis domain with padding
  const prices = displayData.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const yDomain = [minPrice * 0.98, maxPrice * 1.02]

  return (
    <div style={{ height }} className="relative">
      {comparison && isDragging && (
        <div className="absolute left-3 top-3 z-10 rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
          <div className="font-semibold text-gray-900">
            {formatUsdPrice(comparison.newer.price)}
          </div>
          <div
            className="mt-0.5 font-semibold"
            style={{ color: comparison.stroke }}
          >
            {formatUsdDelta(comparison.delta)} (
            {formatPercentDelta(comparison.percent)})
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={CHART_CONFIG.margins}
          onMouseDown={e => {
            const p = e?.activePayload?.[0]?.payload as
              | { timestamp: number; price: number }
              | undefined
            if (!p) return
            setIsDragging(true)
            setDragAnchor({ timestamp: p.timestamp, price: p.price })
            setDragCurrent({ timestamp: p.timestamp, price: p.price })
          }}
          onMouseMove={e => {
            if (!isDragging) return
            const p = e?.activePayload?.[0]?.payload as
              | { timestamp: number; price: number }
              | undefined
            if (!p) return
            setDragCurrent({ timestamp: p.timestamp, price: p.price })
          }}
          onMouseUp={() => resetSelection()}
          onMouseLeave={() => resetSelection()}
        >
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
            <linearGradient
              id={`highlight-gradient-${symbol}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={comparison?.stroke ?? color}
                stopOpacity={0.22}
              />
              <stop
                offset="95%"
                stopColor={comparison?.stroke ?? color}
                stopOpacity={0}
              />
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
            formatter={(value: number) => [formatUsdPrice(value), 'Price']}
            labelFormatter={(label: number) => formatTimestamp(label, range)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          {comparison && (
            <>
              <Area
                type="monotone"
                dataKey="highlightPrice"
                stroke="none"
                fill={`url(#highlight-gradient-${symbol})`}
                isAnimationActive={false}
                connectNulls={false}
              />
              <ReferenceDot
                x={comparison.older.timestamp}
                y={comparison.older.price}
                r={4}
                fill={comparison.stroke}
                stroke="#ffffff"
                strokeWidth={2}
                ifOverflow="extendDomain"
              />
              <ReferenceDot
                x={comparison.newer.timestamp}
                y={comparison.newer.price}
                r={4}
                fill={comparison.stroke}
                stroke="#ffffff"
                strokeWidth={2}
                ifOverflow="extendDomain"
              />
            </>
          )}
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
