# 📐 ARCHITECTURE.md — InsightBoard

```md
# InsightBoard — Architecture

## Purpose

InsightBoard is a cryptocurrency market dashboard demo built to demonstrate:

- Clean data boundaries
- Predictable data flow
- Typed APIs and hooks
- Interactive data visualization
- Maintainable Next.js App Router structure

It intentionally avoids real-time systems and external APIs to keep demos **stable, reproducible, and reviewable**.

---

## Design Constraints

- No external data dependencies
- No WebSockets or streaming updates
- Pull-based data flow only
- Deterministic output on every refresh

These constraints are deliberate, not omissions.

---

## Core Principles

- **API-first**: UI never touches data sources directly
- **Render purity**: no side effects during render
- **Typed boundaries**: Zod + TypeScript at edges
- **Small surfaces**: refactor > rewrite
- **Swap-ready**: fake data can be replaced by real APIs later

---

## High-Level Data Flow

/app/api/coins
↓
fetcher.ts (typed HTTP)
↓
useCoins.ts (React Query)
↓
Dashboard / Charts

All data access flows through `/api/coins`.

---

## Directory Responsibilities

### `/app/api/coins`
- Single data boundary
- Returns deterministic fake data
- Mimics a real backend contract

### `/lib/fakeData.ts`
- Generates realistic but deterministic price history
- No fetch logic
- No UI concerns

### `/lib/fetcher.ts`
- Centralized HTTP client
- Handles parsing and error normalization

### `/lib/useCoins.ts`
- TanStack Query hook
- Cache, refetch, and loading states

### `/components/charts/*`
- Pure presentation components
- Typed props only
- No data fetching or mutation

---

## Chart Architecture

Charts support:

- Multiple time ranges (1D, 7D, 1M, 1Y)
- Interactive hover and comparison
- Custom tooltips
- Optional smoothing per asset

All chart inputs are **plain typed objects**, not raw API responses.

---

## State Management

- Server state: TanStack Query
- UI state: local component state
- No global mutable state
- No Redux / Zustand by design

This keeps the app predictable and debuggable.

---

## Styling Strategy

- Tailwind CSS
- Semantic utility classes
- Skeletons for loading states
- Avoid `transition-all`
- Respect `prefers-reduced-motion`

---

## Performance Considerations

- Server Components by default
- Client Components only for charts
- Minimal hydration surface
- Cached queries via React Query

---

## Security & Safety

- No secrets
- No API keys
- No user data persistence
- No financial transactions

This project is demo-safe by design.

---

## Future Swap Path (Not Implemented)

- Replace `fakeData.ts` with real API adapter
- Keep `/api/coins` contract unchanged
- Charts and UI remain untouched

---

## Summary

InsightBoard demonstrates **how to structure a data-heavy dashboard correctly**, not how to predict markets.

It prioritizes:
- Clarity over cleverness
- Boundaries over shortcuts
- Stability over spectacle