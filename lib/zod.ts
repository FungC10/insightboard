import { z } from 'zod'

// Zod schemas for runtime validation
export const CoinHistoryPointSchema = z.object({
  timestamp: z.number(),
  price: z.number().positive(),
})

export const CoinSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  currentPrice: z.number().positive(),
  priceChange24h: z.number(),
  marketCap: z.number().positive(),
  totalVolume: z.number().positive(),
  history: z.array(CoinHistoryPointSchema),
})

export const CoinsResponseSchema = z.object({
  coins: z.array(CoinSchema),
})

// Provider schemas
export const ProviderCoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  current_price: z.number(),
  price_change_percentage_24h: z.number(),
})

export const ProviderCoinHistorySchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
})

// Type inference
export type Coin = z.infer<typeof CoinSchema>
export type CoinHistoryPoint = z.infer<typeof CoinHistoryPointSchema>
export type CoinsResponse = z.infer<typeof CoinsResponseSchema>
