import { NextRequest, NextResponse } from 'next/server'
import { getCoins } from '@/lib/fetcher'
import { CoinsResponseSchema } from '@/lib/zod'

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
    const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean)
    
    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No valid coin IDs provided' },
        { status: 400 }
      )
    }
    
    // Fetch coins data
    const coins = await getCoins(ids)
    
    // Validate response with Zod
    const response = { coins }
    const validatedResponse = CoinsResponseSchema.parse(response)
    
    return NextResponse.json(validatedResponse)
    
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
