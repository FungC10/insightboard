# InsightBoard — Architecture (v0)

**Purpose (2 lines)**  
A crypto market dashboard that fetches live prices and renders interactive charts.  
Goals: clean DX, SSR-safe animations, fast data, and recruiter-friendly code.

**Tech**: Next.js 14 App Router • Tailwind • TanStack Query • Recharts • TypeScript • Zod

**Principles**

- Small surfaces per change. Refactor > rewrite.
- No side effects in render. Variants/constants live in `/lib`.
- Animations: no `transition-all` on motion elements.
- Data flows: `/app/api/*` (mocked API layer) → `fetcher.ts` (typed HTTP) → hooks → components.

**Directory contracts**

- `/app/(app)/**` = product pages, server components by default.
- `/app/api/**` = API routes; single source of data (currently mocked with fake data).
- `/components/ui/**` = headless UI primitives.
- `/components/charts/**` = chart wrappers; props are typed POJOs.
- `/lib/fetcher.ts` = all network; calls `/api/coins`, returns parsed+validated data.
- `/lib/fakeData.ts` = fake data generation only (no fetch logic).
- `/lib/constants.ts` = variants, breakpoints, durations.
- `/lib/types.ts` & `/lib/zod.ts` = shared types & schemas.

**API Map (v0)**

- `GET /api/coins?ids=bitcoin,ethereum` → `{ coins: [{ id, symbol, price, change24h, history[] }] }`
  - Backed by deterministic fake data from `/lib/fakeData.ts`
  - Production-shaped architecture with demo-safe data
  - Clean swap path to real backend later

**Styling rules**

- Dark by default, use semantic classes.
- Skeletons for loading; no layout shift.

**Commit style**  
`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`. Prefer 1–2 file diffs.
