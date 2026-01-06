/**
 * Moving average smoothing utility for chart presentation
 * This is presentation-only and does not modify the underlying data
 */
export function movingAverage(
  data: { timestamp: number; price: number }[],
  window: number
): { timestamp: number; price: number }[] {
  if (window <= 1 || !data || data.length === 0) return data

  return data.map((point, i) => {
    const start = Math.max(0, i - window + 1)
    const slice = data.slice(start, i + 1)
    const avg = slice.reduce((sum, p) => sum + p.price, 0) / slice.length

    return { ...point, price: Math.round(avg * 100) / 100 }
  })
}
