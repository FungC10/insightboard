import { NextRequest, NextResponse } from 'next/server'
import { FAKE_COINS } from '@/lib/fakeData'
import { CoinsResponseSchema } from '@/lib/zod'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing ids parameter' },
        { status: 400 }
      )
    }

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

    // Filter fake coins by requested IDs
    const coins = FAKE_COINS.filter(coin => ids.includes(coin.id))

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
