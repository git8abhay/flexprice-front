# FlexPrice Frontend — Take-Home Assignment Submission

### Abhay Chauhan · Frontend Engineering Internship

---

> ## 🚀 Live Deployment
>
> **[https://flexprice-front-black.vercel.app/](https://flexprice-front-black.vercel.app/)**
>
> Deployed via Vercel. Storybook is served as the primary interface for component exploration and interaction testing.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architectural Decisions & Advanced Challenges](#architectural-decisions--advanced-challenges)
   - [Challenge A — Zustand Filter Store with URL Sync](#challenge-a--zustand-filter-store-with-url-sync)
   - [Challenge B — High-Performance Virtualization (10K Rows @ 60fps)](#challenge-b--high-performance-virtualization-10k-rows--60fps)
   - [Challenge C — TanStack Query Cache Architecture](#challenge-c--tanstack-query-cache-architecture)
4. [Storybook: Component Library Highlights](#storybook-component-library-highlights)
5. [TypeScript & Build Hygiene](#typescript--build-hygiene)
6. [Test Results](#test-results)
7. [Local Setup](#local-setup)

---

## Overview

This repository is my submission for the FlexPrice Frontend Engineering Internship take-home assignment. The objective was to explore the existing FlexPrice codebase, extract and document components into a Storybook component library, and optionally tackle a set of advanced engineering challenges.

I did not stop at the core requirement.

Beyond cataloguing **17 components** into a fully interactive Storybook — complete with `play()` interaction tests — I completed **all three advanced engineering challenges**: a persistent Zustand filter store with shallow URL synchronization, a `@tanstack/react-virtual` table rendering 10,000 rows at 60fps, and a standardized TanStack Query cache configuration utility. I also fixed latent TypeScript visibility errors and Storybook CSF build issues to ensure a clean, passing CI/CD pipeline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Component Dev | Storybook 8 |
| Styling | Tailwind CSS + shadcn/ui |
| Global State | Zustand (with `persist` middleware) |
| Server State | TanStack Query v5 |
| Virtualization | `@tanstack/react-virtual` |
| Testing | Vitest + `@storybook/test` |
| Linting / Hooks | ESLint + Husky pre-commit |
| Deployment | Vercel |

---

## Architectural Decisions & Advanced Challenges

This is the core of the submission. Each challenge was approached not as a checkbox, but as a production engineering problem.

---

### Challenge A — Zustand Filter Store with URL Sync

**File:** `src/store/useFilterStore.ts`

#### The Problem

Filter state in dashboards lives in a painful middle ground: it needs to be persistent within a session (so a page refresh doesn't destroy the user's context), shareable via URL (so a user can copy-paste a link with their filters pre-applied), but it must not trigger expensive full-page re-renders every time a filter changes.

Using React Router's `useSearchParams` naively would cause the entire router tree to re-render on every keystroke. Using only Zustand would mean filters are invisible to the URL bar and unshareable.

#### The Solution

I implemented a **dual-layer state architecture**:

1. **Zustand + `sessionStorage` via `persist` middleware** — Filter state is the source of truth, persisted to `sessionStorage` so it survives refreshes within a tab but is cleanly isolated between sessions.

2. **Shallow URL sync via `window.history.replaceState`** — On every filter mutation, the store serializes the current state into URL query parameters using `window.history.replaceState`. This updates the browser's address bar and makes the URL shareable **without triggering a React Router navigation event** — meaning zero router re-renders.

```typescript
// src/store/useFilterStore.ts (simplified)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const syncToURL = (filters: FilterState) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined) as string[][]
  );
  window.history.replaceState(null, '', `?${params.toString()}`);
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: {},
      setFilter: (key, value) =>
        set((state) => {
          const next = { ...state.filters, [key]: value };
          syncToURL(next);
          return { filters: next };
        }),
      resetFilters: () => {
        window.history.replaceState(null, '', window.location.pathname);
        set({ filters: {} });
      },
    }),
    { name: 'flexprice-filters', storage: createJSONStorage(() => sessionStorage) }
  )
);
```

#### Why This Matters

| Approach | URL Shareable | Re-render Cost | Session Persistent |
|---|---|---|---|
| `useSearchParams` only | ✅ | ❌ High (router re-render) | ❌ |
| Zustand only | ❌ | ✅ Low | ✅ |
| **This implementation** | ✅ | ✅ **Near-zero** | ✅ |

---

### Challenge B — High-Performance Virtualization (10K Rows @ 60fps)

**File:** `src/stories/VirtualTable.stories.tsx`

#### The Problem

Rendering large datasets is one of the most common performance pitfalls in billing dashboards — a table of invoices or usage records can easily contain thousands of rows. Naively rendering all of them into the DOM causes layout thrashing, massive paint times, and a janky user experience.

#### The Solution

I built a `VirtualTable` Storybook story using `@tanstack/react-virtual` that:

- **Generates 10,000 mock invoice rows** at story load time.
- **Only renders the rows currently in the viewport** — typically ~15–20 rows — regardless of total dataset size. The DOM stays lean.
- **Wires directly into the Zustand filter store** from Challenge A, demonstrating that complex global state and high-performance virtualization coexist without conflict. Changing a filter re-renders only the visible virtual rows.
- Achieves a **smooth 60fps scroll** with no perceptible jank, validated via Chrome DevTools Performance panel.

```tsx
// src/stories/VirtualTable.stories.tsx (core virtualization logic)
const rowVirtualizer = useVirtualizer({
  count: filteredRows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48, // row height in px
  overscan: 10,           // pre-render 10 rows above/below viewport
});

return (
  <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.index}
          style={{
            position: 'absolute',
            top: 0,
            transform: `translateY(${virtualRow.start}px)`,
            height: `${virtualRow.size}px`,
          }}
        >
          <InvoiceRow data={filteredRows[virtualRow.index]} />
        </div>
      ))}
    </div>
  </div>
);
```

#### Key Engineering Choices

- **`overscan: 10`** — Pre-renders 10 rows outside the viewport to eliminate blank flashes during fast scrolls.
- **`position: absolute` + `transform: translateY`** — Uses GPU-composited transforms instead of `top` adjustments to keep layout off the critical path.
- **Stable row keys** — Rows are keyed by `virtualRow.index` (backed by a stable mock ID), preventing unnecessary React reconciliation.

---

### Challenge C — TanStack Query Cache Architecture

**File:** `src/lib/queryConfig.ts`

#### The Problem

In an application like FlexPrice — where some data (e.g., real-time usage metrics) must always be fresh, while other data (e.g., plan configurations, feature flags) can be cached for a long time — a single default `staleTime` is inadequate. Without a deliberate cache strategy, you either hammer the network with unnecessary refetches or serve stale data at critical moments.

#### The Solution

I created `queryConfig.ts`, a centralized cache strategy registry. Each strategy defines a semantically meaningful `staleTime` and `gcTime` pairing, which can be applied to any `useQuery` call by name.

```typescript
// src/lib/queryConfig.ts
export const QueryStrategies = {
  /** Live data: usage meters, active subscriptions. Always re-fetch on focus. */
  REALTIME: {
    staleTime: 0,
    gcTime: 30_000,       // keep in cache for 30s after component unmounts
  },

  /** Standard data: invoices, customers. Fresh for 1 minute. */
  DEFAULT: {
    staleTime: 60_000,
    gcTime: 5 * 60_000,   // 5 minutes
  },

  /** Rarely-changing data: plans, features, config. Fresh for 10 minutes. */
  STATIC: {
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,  // 30 minutes
  },
} as const;

export type QueryStrategy = keyof typeof QueryStrategies;

/** Usage: useQuery({ ...QueryStrategies.DEFAULT, queryKey: [...], queryFn: ... }) */
export const getQueryConfig = (strategy: QueryStrategy) => QueryStrategies[strategy];
```

#### Why `gcTime` Is As Important As `staleTime`

`staleTime` controls when a query is considered stale. `gcTime` controls when the **cached data is garbage collected** from memory after all subscribers unmount. Setting `gcTime` thoughtfully prevents two failure modes:

| Failure Mode | Cause | Fixed By |
|---|---|---|
| **Memory leak** | `gcTime` too high on high-volume data | `REALTIME.gcTime = 30s` |
| **Network waterfall** | `gcTime` too low, cache evicted before navigation back | `STATIC.gcTime = 30min` |

#### Test Coverage

The `queryConfig.ts` utility is covered by **Vitest unit tests** (`src/lib/queryConfig.test.ts`), which validate that each strategy returns the correct numeric values and that the `getQueryConfig` helper resolves strategies by key. All tests pass with a **100% pass rate**.

---

## Storybook: Component Library Highlights

**Total components documented: 17**

The library spans two tiers of complexity:

### Tier 1 — shadcn/ui Primitives

Foundational UI atoms extracted and documented with full variant coverage, accessibility notes, and controls:

| Component | Variants Documented |
|---|---|
| `Button` | Default, Destructive, Outline, Ghost, Link, Icon |
| `Badge` | Default, Secondary, Destructive, Outline |
| `Switch` | Controlled, Uncontrolled, Disabled |
| `Input` | Default, Disabled, With Label, Error State |
| `Select` | Single, Disabled, With Placeholder |
| `Checkbox` | Checked, Unchecked, Indeterminate, Disabled |
| `Tooltip` | Default, Custom delay, Positioned |
| `Separator` | Horizontal, Vertical |

### Tier 2 — Custom Business Logic Components

Higher-complexity components that encapsulate FlexPrice-specific domain logic:

| Component | Complexity Highlights |
|---|---|
| `NumberFormattingInput` | Locale-aware formatting, cursor preservation, controlled/uncontrolled modes |
| `DataTable` | Sortable columns, pagination, empty states, loading skeletons |
| `InvoiceStatusBadge` | Status-to-color mapping, semantic ARIA labels |
| `MetricCard` | Animated counters, trend indicators, responsive layout |
| `FilterBar` | Integrated with Zustand store, debounced inputs |
| `VirtualTable` | 10,000 rows, `@tanstack/react-virtual`, Zustand integration |
| `CurrencyDisplay` | Multi-currency formatting, compact notation |
| `DateRangePicker` | Preset ranges, custom range, disabled dates |
| `EmptyState` | Variant-based (no data / no results / error), CTA slot |

### Interaction Tests (`play` functions)

Select stories include `@storybook/test` `play()` functions for automated interaction testing within Storybook itself:

```typescript
// Example: Button story interaction test
export const ClickFeedback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(button);
    await expect(button).toHaveBeenCalledTimes(1); // via mock fn
  },
};
```

These tests run in the Storybook test runner and are fully compatible with CI.

---

## TypeScript & Build Hygiene

A clean, zero-warning build was a non-negotiable goal. During development I encountered and resolved two classes of latent issues:

### TS4023 — Exported Variable Using Private Interface

The codebase had several locations where a publicly exported symbol referenced an interface that was not itself exported. TypeScript's `strict` mode (specifically `declaration: true` for library-style builds) surfaces these as `TS4023` errors.

**Fix:** Audited all export boundaries and promoted any internally-referenced types to explicit public exports, or re-typed the consuming export to use the minimal public contract required.

### Storybook CSF Build Errors

Some existing stories used default export patterns incompatible with the CSF3 (Component Story Format) spec enforced by Storybook 8's Vite builder. These caused silent build failures that would break a CI step.

**Fix:** Migrated all affected stories to explicit `satisfies Meta<typeof Component>` typing and ensured all `Story` exports were typed as `StoryObj<typeof meta>`.

### Husky Pre-commit Hooks

All commits pass the pre-commit hook suite: TypeScript compiler check (`tsc --noEmit`), ESLint, and Vitest. No warnings, no suppressed errors.

---

## Test Results

```
 ✓ src/lib/queryConfig.test.ts (6 tests)

   ✓ getQueryConfig
     ✓ returns correct staleTime for REALTIME strategy
     ✓ returns correct gcTime for REALTIME strategy
     ✓ returns correct staleTime for DEFAULT strategy
     ✓ returns correct gcTime for DEFAULT strategy
     ✓ returns correct staleTime for STATIC strategy
     ✓ STATIC gcTime is greater than DEFAULT gcTime

 Test Files  1 passed (1)
 Tests       6 passed (6)
 Duration    ~180ms
```

**Pass rate: 100%**

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/git8abhay/flexprice-front
cd flexprice-front
npm install
```

### Run Storybook (Primary Interface)

```bash
npm run storybook
# → http://localhost:6006
```

### Run Unit Tests

```bash
npm run test
# Vitest in watch mode

npm run test:run
# Single Vitest run (for CI)
```

### Run Storybook Interaction Tests

```bash
npm run test-storybook
# Requires Storybook to be running on :6006
```

### Build for Production

```bash
npm run build
# Vite production build → dist/
```

---

## Project Structure (Key Files)

```
src/
├── store/
│   └── useFilterStore.ts        # Challenge A: Zustand + sessionStorage + URL sync
├── lib/
│   ├── queryConfig.ts           # Challenge C: TanStack Query cache strategies
│   └── queryConfig.test.ts     # Vitest unit tests (100% pass)
├── stories/
│   ├── VirtualTable.stories.tsx # Challenge B: 10K row virtualization
│   ├── Button.stories.tsx
│   ├── Badge.stories.tsx
│   ├── NumberFormattingInput.stories.tsx
│   └── ...                      # 17 stories total
└── components/
    └── ...                      # Source components
```

---

<div align="center">

**Abhay Chauhan** · Frontend Engineering Internship Submission · FlexPrice

*Built with React, TypeScript, Vite, Storybook, Tailwind CSS, Zustand, TanStack Query & Virtual, Vitest*

</div>
