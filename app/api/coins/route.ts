import { NextRequest, NextResponse } from 'next/server'
import { getFakeCoins } from '@/lib/fakeData'
import { getOrCreateMarketState } from '@/lib/marketState'
import { CoinsResponseSchema } from '@/lib/zod'
import { TimeRange } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    const rangeParam = searchParams.get('range') || '1D'

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing ids parameter' },
        { status: 400 }
      )
    }

    // Validate range
    const validRanges: TimeRange[] = ['1D', '7D', '1M', '1Y']
    const range = validRanges.includes(rangeParam as TimeRange)
      ? (rangeParam as TimeRange)
      : '1D'

    // Parse comma-separated IDs
    const ids = idsParam
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No valid coin IDs provided' },
        { status: 400 }
      )
    }

    // Get or create market state (persists across requests)
    const marketState = getOrCreateMarketState()

    // Generate coins with market state-aware history and prices
    const coins = getFakeCoins(ids, marketState, range)

    if (coins.length === 0) {
      return NextResponse.json(
        { error: `No coins found for IDs: ${ids.join(', ')}` },
        { status: 404 }
      )
    }

    // Validate response with Zod
    const response = { coins }
    const validatedResponse = CoinsResponseSchema.parse(response)

    return NextResponse.json(validatedResponse)
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
