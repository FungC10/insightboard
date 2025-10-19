interface StatCardProps {
  title: string
  value: string
  delta: number
  trend?: 'up' | 'down'
}

export default function StatCard({ title, value, delta, trend }: StatCardProps) {
  const isPositive = delta >= 0
  const trendDirection = trend || (isPositive ? 'up' : 'down')
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={`text-sm flex items-center font-semibold ${
        trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        <span className="mr-1">
          {trendDirection === 'up' ? '↗' : '↘'}
        </span>
        {isPositive ? '+' : ''}{delta.toFixed(2)}%
      </div>
    </div>
  )
}
