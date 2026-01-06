# Fake Data Documentation

## Overview

InsightBoard uses locally generated fake data instead of external APIs. This allows the application to run without any API keys or external dependencies, making it perfect for development, testing, and demonstrations.

## Data Source

All fake data is generated and stored in `/lib/fakeData.ts`. The data is served through the `/api/coins` endpoint, which provides a production-shaped API boundary backed by deterministic fake data.

## Available Coins

The fake data includes three cryptocurrencies:

### Bitcoin (BTC)
- **ID**: `bitcoin`
- **Symbol**: `BTC`
- **Current Price**: $43,250.50
- **24h Change**: +2.34%
- **Market Cap**: $850,000,000,000
- **Total Volume**: $25,000,000,000

### Ethereum (ETH)
- **ID**: `ethereum`
- **Symbol**: `ETH`
- **Current Price**: $2,650.75
- **24h Change**: -1.23%
- **Market Cap**: $320,000,000,000
- **Total Volume**: $15,000,000,000

### Cardano (ADA)
- **ID**: `cardano`
- **Symbol**: `ADA`
- **Current Price**: $0.485
- **24h Change**: +0.87%
- **Market Cap**: $17,000,000,000
- **Total Volume**: $500,000,000

## Price History Generation

Each coin includes a price history with 100 data points generated using a deterministic algorithm:

### Algorithm Details

1. **Time Range**: 
   - Data points span approximately 8.3 hours (100 points × 5 minutes)
   - Timestamps are calculated backwards from the current time

2. **Price Variation**:
   - Uses sine and cosine functions to create realistic price movements
   - Maximum variation: ±2% from the base price
   - Formula: `price = basePrice * (1 + variation)`
   - Variation: `(Math.sin(i * 0.1) + Math.cos(i * 0.15)) * 0.02`

3. **Data Points**:
   - 100 points by default
   - 5-minute intervals between points
   - Prices rounded to 2 decimal places

### Example History Generation

```typescript
function generateFakeHistory(basePrice: number, points: number = 100) {
  const history = []
  const now = Date.now()
  const stepMs = 5 * 60 * 1000 // 5 minutes

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i - 1) * stepMs
    const variation = (Math.sin(i * 0.1) + Math.cos(i * 0.15)) * 0.02
    const price = basePrice * (1 + variation)
    
    history.push({
      timestamp,
      price: Math.round(price * 100) / 100,
    })
  }

  return history
}
```

## Fetching Data

### API Endpoint: `/api/coins`

All data access flows through the `/api/coins` endpoint, which serves as the single source of data for the application.

**Endpoint:**
```
GET /api/coins?ids=bitcoin,ethereum
```

**Parameters:**
- `ids`: Comma-separated list of coin IDs to fetch (e.g., `bitcoin,ethereum`)

**Returns:**
- `{ coins: Coin[] }`: JSON response with array of coin objects matching the requested IDs

**Behavior:**
- Filters `FAKE_COINS` array by the requested IDs
- Returns 404 if no coins match the requested IDs
- Validates response with Zod schemas
- Uses `export const dynamic = 'force-dynamic'` for proper Next.js routing

**Example Usage:**

```typescript
import { fetchCoins } from '@/lib/fetcher'

// Fetch Bitcoin and Ethereum
const coins = await fetchCoins(['bitcoin', 'ethereum'])

// Returns:
// [
//   { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', ... },
//   { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', ... }
// ]
```

**Client-side Usage (React Query):**

```typescript
import { useCoins } from '@/lib/useCoins'

// In a React component
const { data: coins, isLoading } = useCoins(['bitcoin', 'ethereum'])
```

## Data Structure

Each coin object follows this structure:

```typescript
interface Coin {
  id: string                    // Unique identifier (e.g., 'bitcoin')
  symbol: string                // Ticker symbol (e.g., 'BTC')
  name: string                  // Full name (e.g., 'Bitcoin')
  currentPrice: number          // Current price in USD
  priceChange24h: number        // 24h price change percentage
  marketCap: number             // Market capitalization in USD
  totalVolume: number            // 24h trading volume in USD
  history: CoinHistoryPoint[]    // Array of historical price points
}

interface CoinHistoryPoint {
  timestamp: number              // Unix timestamp in milliseconds
  price: number                  // Price at that timestamp
}
```

## Integration

The fake data is integrated into the application through:

1. **`/app/api/coins/route.ts`**: API route that serves fake data from `FAKE_COINS`
2. **`/lib/fetcher.ts`**: Fetcher function that calls `/api/coins` endpoint
3. **`/lib/useCoins.ts`**: React Query hook that uses `fetchCoins()` from fetcher
4. **`/lib/fakeData.ts`**: Contains the fake data generation (`FAKE_COINS` and `generateFakeHistory`)
5. **Components**: Dashboard and chart components consume the data via the `useCoins` hook

**Data Flow:**
```
Components → useCoins() → fetchCoins() → /api/coins → FAKE_COINS
```

## Advantages

- ✅ **No API Keys Required**: Works out of the box
- ✅ **No Rate Limits**: Unlimited requests
- ✅ **Deterministic**: Same data every time (good for testing)
- ✅ **Production-Shaped Architecture**: Real API boundary for clean separation
- ✅ **Offline**: Works without internet connection
- ✅ **Realistic**: Price variations mimic real market behavior
- ✅ **Easy Migration Path**: Swap `/api/coins` implementation to real backend later
- ✅ **Stable Demos**: Reproducible results every time
- ✅ **Reproducible Charts**: Consistent data for testing

## Customization

To add more coins or modify existing data:

1. Edit `/lib/fakeData.ts`
2. Add new entries to the `FAKE_COINS` array
3. Use `generateFakeHistory()` to create price history
4. The data will be automatically available through the `/api/coins` endpoint

### Example: Adding a New Coin

```typescript
{
  id: 'solana',
  symbol: 'SOL',
  name: 'Solana',
  currentPrice: 98.50,
  priceChange24h: 3.21,
  marketCap: 45000000000,
  totalVolume: 2000000000,
  history: generateFakeHistory(98.50),
}
```

## Notes

- The fake data is **static** - prices don't update in real-time
- Price history is **deterministic** - same inputs produce same outputs
- All data flows through `/api/coins` endpoint for clean architecture
- Fake data generation is invisible to the UI layer
- All prices are in USD
- Timestamps are in milliseconds (Unix epoch)
- The API route uses `export const dynamic = 'force-dynamic'` for proper Next.js behavior

