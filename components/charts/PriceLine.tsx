'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { CHART_CONFIG } from '@/lib/constants'

interface PriceLineProps {
  data: { timestamp: number; price: number }[]
  height?: number
}

export default function PriceLine({ data, height = CHART_CONFIG.defaultHeight }: PriceLineProps) {
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

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_CONFIG.margins}>
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
            domain={['dataMin', 'dataMax']}
            hide
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={CHART_CONFIG.strokeColor}
            strokeWidth={CHART_CONFIG.strokeWidth}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
