# InsightBoard — Architecture (v0)

**Purpose (2 lines)**  
A crypto market dashboard that fetches live prices and renders interactive charts.  
Goals: clean DX, SSR-safe animations, fast data, and recruiter-friendly code.

**Tech**: Next.js 14 App Router • Tailwind • TanStack Query • Recharts • TypeScript • Zod

**Principles**  
- Small surfaces per change. Refactor > rewrite.  
- No side effects in render. Variants/constants live in `/lib`.  
- Animations: no `transition-all` on motion elements.  
- Data flows: `/app/api/*` → `fetcher.ts` (typed) → hooks → components.

**Directory contracts**  
- `/app/(app)/**` = product pages, server components by default.  
- `/components/ui/**` = headless UI primitives.  
- `/components/charts/**` = chart wrappers; props are typed POJOs.  
- `/lib/fetcher.ts` = all network; returns parsed+validated data.  
- `/lib/constants.ts` = variants, breakpoints, durations.  
- `/lib/types.ts` & `/lib/zod.ts` = shared types & schemas.

**API Map (v0)**  
- `GET /api/coins?ids=bitcoin,ethereum` → `{ id, symbol, price, change24h, history[] }`

**Styling rules**  
- Dark by default, use semantic classes.  
- Skeletons for loading; no layout shift.

**Commit style**  
`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`. Prefer 1–2 file diffs.