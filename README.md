# 🚀 InsightBoard

An engineering-focused cryptocurrency market dashboard demo built with Next.js App Router.  
Designed to showcase **clean data flow, typed APIs, interactive charts, and production-shaped architecture** — without relying on unstable external APIs.

> This is a demo application with **deterministic local data**, intentionally built to be safe, reproducible, and reviewable.

---

## TL;DR

InsightBoard demonstrates:

- API-first data boundaries (`/api/coins`)
- Deterministic fake data for stable demos
- Typed data fetching with TanStack Query
- Interactive financial charts with clean UX
- Production-shaped architecture with a clean swap path to real APIs

This is an **engineering demo**, not a trading platform.

---

## ✨ Features

- **📊 Deterministic Fake Data**
  - Locally generated crypto market data
  - No API keys, no rate limits, works offline
  - Stable and reproducible for demos

- **📈 Interactive Charts**
  - Price history visualization with Recharts
  - Hover, compare, and time-range selection
  - Typed props and predictable rendering

- **⚡ Modern App Router Setup**
  - Next.js 14 App Router
  - Server components by default
  - Client components only where needed

- **🔒 Type Safety**
  - End-to-end TypeScript
  - Zod schemas for runtime validation

- **📱 Responsive UI**
  - Tailwind CSS
  - Accessible layouts
  - Mobile-first design

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Validation**: Zod
- **Data Source**: Local deterministic fake data
- **Deployment**: Vercel-ready

---

## 🚀 Quick Start

```bash
npm install
npm run dev

Open: http://localhost:3000

No environment variables or API keys required.

⸻

📁 Project Structure (Simplified)

app/
 ├─ (app)/dashboard        # Main dashboard
 ├─ api/coins              # Mocked API boundary
 ├─ layout.tsx
 └─ page.tsx

components/
 ├─ charts/                # Chart wrappers
 ├─ ui/                    # UI primitives
 └─ layout/                # Header / Footer

lib/
 ├─ fakeData.ts            # Deterministic data generator
 ├─ useCoins.ts            # React Query hook
 ├─ fetcher.ts             # Typed HTTP client
 ├─ zod.ts                 # Validation schemas
 └─ constants.ts


⸻

📊 Data Model & Flow
	•	All data flows through GET /api/coins
	•	Fake data is generated in lib/fakeData.ts
	•	React Query fetches via HTTP (not direct imports)
	•	Charts consume typed hook results

This preserves:
	•	Clear data boundaries
	•	Easy replacement with real APIs later
	•	Production-shaped mental model

⸻

🧪 Testing Strategy
	•	Unit tests: utilities, schemas
	•	Component tests: charts, stat cards
	•	API tests: /api/coins response shape

(E2E intentionally omitted to keep the demo focused.)

⸻

📄 License

MIT

⸻

Built by Pazu
https://pazu.dev