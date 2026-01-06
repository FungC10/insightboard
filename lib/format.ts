const USD_2DP = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const USD_0DP = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function formatUsdPrice(value: number): string {
  return `$${USD_2DP.format(value)}`
}

export function formatUsdDelta(value: number): string {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${USD_2DP.format(Math.abs(value))}`
}

export function formatNumber0(value: number): string {
  return USD_0DP.format(value)
}

export function formatPercentDelta(value: number): string {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${Math.abs(value).toFixed(2)}%`
}


