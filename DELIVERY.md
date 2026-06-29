# Mark-03 — Delivery Status

> Last updated: 2026-06-29
> Branch: `claude/emergency-funds-app-spec-f3x7wt`
> Status: **Planning**

---

## Overall Progress

```
Phase 1 — Core MVP        [ ] 0%
Phase 2 — Projections     [ ] 0%
Phase 3 — Contributions   [ ] 0%
Phase 4 — Google Sheets   [ ] 0%
Phase 5 — Polish          [ ] 0%
```

---

## Phase 1 — Core MVP

**Goal:** Working app with fund management, target config, and dashboard.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Project scaffold (Next.js 14 + Tailwind + shadcn/ui) | `todo` | |
| 1.2 | Zustand store + localStorage adapter | `todo` | |
| 1.3 | Settings page: monthly expenses, target months, medical buffer | `todo` | |
| 1.4 | Funds page: list, add, edit, delete | `todo` | |
| 1.5 | Fund form: name, type, balance, expected return % | `todo` | |
| 1.6 | Dashboard: total saved, target, gap, % progress bar | `todo` | |
| 1.7 | Dashboard: fund breakdown donut chart (Recharts) | `todo` | |
| 1.8 | Dashboard: months covered indicator | `todo` | |
| 1.9 | Navigation / layout shell | `todo` | |

**Deliverable:** Locally runnable app where you can configure a target and manage fund balances.

---

## Phase 2 — Projections

**Goal:** Year-over-year table and chart showing nominal vs. real purchasing power vs. target.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Inflation rate config in Settings | `todo` | Default 4% |
| 2.2 | Per-fund expected return % (already in fund form) | `todo` | |
| 2.3 | Projection math utility (nominal, real, target) | `todo` | |
| 2.4 | Projections page: year-over-year table (1–10 yr) | `todo` | |
| 2.5 | Projections page: line chart (3 lines) | `todo` | |
| 2.6 | Horizon slider (1–20 years) | `todo` | |
| 2.7 | On-track / At-risk indicator | `todo` | |

**Deliverable:** Projections page showing how your savings hold up against inflation over time.

---

## Phase 3 — Contributions

**Goal:** Log every deposit, track history, visualize monthly progress.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Contribution model: date, fund, amount, notes | `todo` | |
| 3.2 | Log contribution form (quick-add from Dashboard) | `todo` | |
| 3.3 | Contributions history page: table + filters | `todo` | |
| 3.4 | Monthly bar chart: contributed per month | `todo` | |
| 3.5 | Optional monthly contribution goal + progress | `todo` | |

**Deliverable:** Full contribution history with visual monthly summary.

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
| 5.1 | Mobile-responsive layout audit | `todo` | |
| 5.2 | Dark mode (Tailwind `dark:` + system preference) | `todo` | |
| 5.3 | CSV export (funds + contributions) | `todo` | |
| 5.4 | Empty states and onboarding flow for new users | `todo` | |
| 5.5 | Vercel deployment + environment config | `todo` | |

**Deliverable:** Production-ready app deployed on Vercel.

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Spec complete | 2026-06-29 | `done` |
| Phase 1 complete | TBD | `todo` |
| Phase 2 complete | TBD | `todo` |
| Phase 3 complete | TBD | `todo` |
| Phase 4 complete | TBD | `todo` |
| Phase 5 / Launch | TBD | `todo` |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-29 | Next.js 14 + Tailwind + shadcn/ui | Best DX for solo dev; deploys to Vercel |
| 2026-06-29 | localStorage as primary store | No backend needed for personal use |
| 2026-06-29 | Google Sheets as sync/backup | Familiar, durable, editable outside the app |
| 2026-06-29 | Fixed 4% inflation rate (configurable) | Keeps projections simple; BSP target range |
| 2026-06-29 | Medical buffer as fixed PHP add-on | Simpler than percentage; user sets exact amount |
| 2026-06-29 | MP2 treated as a fund type with custom return % | Avoids hardcoding dividend; user enters expected % |

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-1 | What is the target monthly contribution amount (if any)? | User |
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
