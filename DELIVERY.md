# Mark-03 — Delivery Status

> Last updated: 2026-07-12
> Branch: `claude/emergency-funds-app-spec-f3x7wt`
> Status: **Phase 1–3 Complete**

---

## Overall Progress

```
Phase 1 — Core MVP        [x] 100%
Phase 2 — Projections     [x] 100%
Phase 3 — Contributions   [x] 100%
Phase 4 — Google Sheets   [ ] 0%
Phase 5 — Polish          [~] 40%  (modern UI design pass done early)
```

---

## Phase 1 — Core MVP

**Goal:** Working app with fund management, target config, and dashboard.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Project scaffold (Next.js 14 + Tailwind + Radix UI) | `done` | shadcn CLI blocked by proxy; components built manually |
| 1.2 | Zustand store + localStorage adapter | `done` | `crypto.randomUUID()` (uuid v14 is ESM-only, breaks Jest) |
| 1.3 | Settings page: monthly expenses, target months, medical buffer | `done` | |
| 1.4 | Funds page: list, add, edit, delete | `done` | |
| 1.5 | Fund form: name, type, balance, expected return % | `done` | |
| 1.6 | Dashboard: total saved, target, gap, % progress bar | `done` | |
| 1.7 | Dashboard: fund breakdown donut chart (Recharts) | `done` | |
| 1.8 | Dashboard: months covered indicator | `done` | |
| 1.9 | Navigation / layout shell | `done` | Sidebar on md+, bottom nav on mobile |

**Deliverable:** ✅ Locally runnable app — build clean, all tests passing.

---

## Phase 2 — Projections

**Goal:** Year-over-year table and chart showing nominal vs. real purchasing power vs. target.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Inflation rate config in Settings | `done` | Default 4% |
| 2.2 | Per-fund expected return % | `done` | In fund form |
| 2.3 | Projection math utility (nominal, real, target) | `done` | 12 unit tests |
| 2.4 | Projections page: year-over-year table (1–10 yr) | `done` | Off-track rows highlighted |
| 2.5 | Projections page: line chart (3 lines) | `done` | Nominal=blue, Real=green, Target=red dashed |
| 2.6 | Horizon input (1–20 years) | `done` | |
| 2.7 | On-track / At-risk indicator | `done` | Badge + per-row status |

**Deliverable:** ✅ Projections page live.

---

## Phase 3 — Contributions

**Goal:** Log every deposit, track history, visualize monthly progress.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Contribution model: date, fund, amount, notes | `done` | Store actions + tests in place since Phase 1 |
| 3.2 | Log contribution form (quick-add from Dashboard) | `done` | Optional "add to fund balance", default on |
| 3.3 | Contributions history page: table + filters | `done` | Filter by fund and month; delete with confirm |
| 3.4 | Monthly bar chart: contributed per month | `done` | Last 12 months, zero-filled; goal reference line |
| 3.5 | Optional monthly contribution goal + progress | `done` | Set in Settings; progress bar on Contributions page |

**Deliverable:** ✅ Full contribution history with visual monthly summary — 123 tests passing.

---

## Phase 4 — Google Sheets Sync

**Goal:** OAuth-based two-way sync with a user-selected Google Sheet.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Google OAuth 2.0 setup (Google Identity Services) | `todo` | Needs GCP project + credentials |
| 4.2 | Sheets API v4 client utility | `todo` | |
| 4.3 | Connect flow: pick or create spreadsheet | `todo` | |
| 4.4 | Push to Sheets: Funds tab, Contributions tab, Settings tab | `todo` | |
| 4.5 | Pull from Sheets: import to overwrite localStorage | `todo` | |
| 4.6 | Sync status: last-synced timestamp + error state | `todo` | |
| 4.7 | Disconnect / revoke OAuth | `todo` | |

**Deliverable:** Data backed up to and restorable from a personal Google Sheet.

---

## Phase 5 — Polish

**Goal:** Mobile-ready, dark mode, export option.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Mobile-responsive layout audit | `done` | Bottom nav, sticky mobile header, responsive grids |
| 5.2 | Modern minimalist design system | `done` | Indigo/slate palette, brand mark, refined components |
| 5.3 | Dark mode (Tailwind `dark:` + system preference) | `todo` | |
| 5.4 | CSV export (funds + contributions) | `todo` | |
| 5.5 | Empty states and onboarding flow for new users | `done` | Setup banner, icon-led empty states |
| 5.6 | Vercel deployment + environment config | `todo` | |

**Deliverable:** Production-ready app deployed on Vercel.

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Spec complete | 2026-06-29 | `done` |
| Phase 1 complete | 2026-06-29 | `done` |
| Phase 2 complete | 2026-06-29 | `done` |
| UI modernization | 2026-06-30 | `done` |
| Phase 3 complete | 2026-07-12 | `done` |
| Phase 4 complete | TBD | `todo` |
| Phase 5 / Launch | TBD | `todo` |

---

## Test & Build Status

- **Unit tests:** 123 passing across 8 suites (calculations, contributions helpers, store, ProgressBar, SummaryCards, FundForm, ContributionForm, QuickAddContribution)
- **Build:** clean — 0 type errors, 0 lint errors; routes: /, /dashboard, /funds, /contributions, /projections, /settings

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-29 | Next.js 14 + Tailwind + shadcn-style UI | Best DX for solo dev; deploys to Vercel |
| 2026-06-29 | localStorage as primary store | No backend needed for personal use |
| 2026-06-29 | Google Sheets as sync/backup | Familiar, durable, editable outside the app |
| 2026-06-29 | Fixed 4% inflation rate (configurable) | Keeps projections simple; BSP target range |
| 2026-06-29 | Medical buffer as fixed PHP add-on | Simpler than percentage; user sets exact amount |
| 2026-06-29 | MP2 treated as a fund type with custom return % | Avoids hardcoding dividend; user enters expected % |
| 2026-06-29 | crypto.randomUUID() instead of uuid package | uuid v14 is ESM-only; incompatible with Jest CommonJS |
| 2026-06-29 | Radix UI primitives built manually | shadcn CLI blocked by network proxy in remote env |
| 2026-06-30 | Indigo/slate design system | Modern minimalist pass across all pages |
| 2026-07-12 | Contribution optionally increments fund balance | One action logs the deposit and keeps balances true |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-1 | ~~What is the target monthly contribution amount (if any)?~~ Now configurable in Settings | Resolved |
| OQ-2 | Should MP2 lock-in period (5 years) surface a warning in projections? | User |
| OQ-3 | GCP project for Sheets OAuth — new project or existing? | User |
| OQ-4 | Should fund balances be auto-fetched from any broker API, or always manual? | User |

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| `todo` | Not started |
| `in-progress` | Actively being built |
| `done` | Complete and verified |
| `blocked` | Waiting on a dependency or decision |
