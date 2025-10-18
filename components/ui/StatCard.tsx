interface StatCardProps {
  title: string
  value: string
  delta: number
}

export default function StatCard({ title, value, delta }: StatCardProps) {
  const isPositive = delta >= 0
  
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`text-sm flex items-center ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        <span className="mr-1">
          {isPositive ? '↗' : '↘'}
        </span>
        {isPositive ? '+' : ''}{delta.toFixed(2)}%
      </div>
    </div>
  )
}
