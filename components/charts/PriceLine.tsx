'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

interface PriceLineProps {
  data: { t: number; p: number }[]
  height?: number
}

export default function PriceLine({ data, height = 200 }: PriceLineProps) {
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
        <LineChart data={data}>
          <XAxis 
            dataKey="t" 
            type="number" 
            scale="time" 
            domain={['dataMin', 'dataMax']}
            hide
          />
          <YAxis 
            dataKey="p" 
            type="number" 
            domain={['dataMin', 'dataMax']}
            hide
          />
          <Line 
            type="monotone" 
            dataKey="p" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
