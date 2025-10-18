// Chart configuration constants
export const CHART_CONFIG = {
  strokeColor: '#3b82f6',
  strokeWidth: 2,
  defaultHeight: 200,
  margins: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  },
} as const

// Timeframe constants
export const TIMEFRAME_MS = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
} as const

// UI constants
export const UI_CONFIG = {
  skeletonHeight: 200,
  statCardHeight: 'auto',
  gridGap: 4,
} as const
