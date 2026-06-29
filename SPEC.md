# Mark-03 — Product Requirements Specification

> Version: 1.0
> Date: 2026-06-29
> Status: Draft

---

## 1. Purpose

Mark-03 is a personal web application for tracking an emergency fund denominated in Philippine Peso (PHP). It answers three questions at a glance:

1. **How much do I have?** — across all fund types in one place.
2. **How far am I from my target?** — based on months of expenses plus a medical buffer.
3. **Is my money keeping up with inflation?** — through year-over-year purchasing power projections.

---

## 2. Scope

### In scope
- Fund registry with CRUD operations and balance management.
- Emergency fund target calculator (expenses × months + medical buffer).
- Inflation-adjusted projections (nominal vs. real value, 1–20 year horizon).
- Contribution log with history and monthly summary chart.
- Data persistence via browser `localStorage`.
- Optional sync to a personal Google Sheet via OAuth.

### Out of scope (v1)
- Multi-user / shared accounts.
- Broker API integrations (balances are entered manually).
- Budget tracking or expense categorisation.
- Currencies other than PHP.
- Mobile app (iOS / Android).

---

## 3. Users

Single personal user. No authentication required for local use. Google OAuth is used only for Sheets sync.

---

## 4. Data Models

### 4.1 Fund

```ts
type FundType = 'cash' | 'stocks_etf' | 'mutual_fund_uitf' | 'mp2';

interface Fund {
  id: string;              // uuid
  name: string;            // e.g. "BDO UITF Balanced"
  type: FundType;
  balance: number;         // PHP, current value
  expectedReturnPct: number; // annual nominal return %, e.g. 7
  updatedAt: string;       // ISO date string
  notes?: string;
}
```

### 4.2 Contribution

```ts
interface Contribution {
  id: string;              // uuid
  fundId: string;          // references Fund.id
  amount: number;          // PHP, positive = deposit
  date: string;            // ISO date string (YYYY-MM-DD)
  notes?: string;
}
```

### 4.3 Settings

```ts
interface Settings {
  monthlyExpenses: number;       // PHP
  targetMonths: number;          // e.g. 6
  medicalBuffer: number;         // PHP, fixed add-on
  inflationRatePct: number;      // annual %, default 4.0
  monthlyContributionGoal?: number; // optional PHP goal per month
  sheetsSpreadsheetId?: string;  // Google Sheets ID if connected
  sheetsLastSyncedAt?: string;   // ISO datetime
}
```

### 4.4 Derived values (computed, never stored)

```ts
interface Summary {
  totalSaved: number;            // sum of all Fund.balance
  target: number;                // monthlyExpenses × targetMonths + medicalBuffer
  gap: number;                   // target − totalSaved (negative = overfunded)
  progressPct: number;           // totalSaved / target × 100
  monthsCovered: number;         // totalSaved / monthlyExpenses
}
```

---

## 5. Projection Formula

For year `n` (n = 0 is today):

```
nominalValue(n) = totalSaved × ∏ (1 + weightedReturn)^n
realValue(n)    = nominalValue(n) / (1 + inflationRate)^n
targetReal(n)   = target × (1 + inflationRate)^n
```

Where `weightedReturn` = Σ (fund.balance / totalSaved × fund.expectedReturnPct / 100).

**On-track condition:** `realValue(n) ≥ targetReal(n)` for all years in the horizon.

---

## 6. Feature Requirements

### 6.1 Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| D-01 | Show total saved across all funds in PHP | P0 |
| D-02 | Show emergency fund target (computed) | P0 |
| D-03 | Show gap (target − saved) with colour coding | P0 |
| D-04 | Show progress bar (% of target reached) | P0 |
| D-05 | Show months covered (totalSaved ÷ monthlyExpenses) | P0 |
| D-06 | Show fund breakdown donut chart (by type) | P1 |
| D-07 | Quick-add contribution button | P1 |
| D-08 | Show last updated date per fund | P2 |

### 6.2 Funds

| ID | Requirement | Priority |
|----|-------------|----------|
| F-01 | List all funds with name, type, balance, expected return | P0 |
| F-02 | Add new fund | P0 |
| F-03 | Edit fund (any field) | P0 |
| F-04 | Delete fund (with confirmation prompt) | P0 |
| F-05 | Show total across all funds | P0 |
| F-06 | Show each fund's % share of total | P1 |

### 6.3 Projections

| ID | Requirement | Priority |
|----|-------------|----------|
| P-01 | Year-over-year table: year, nominal value, real value, inflation-adjusted target | P0 |
| P-02 | Line chart with 3 series: Nominal, Real, Target | P0 |
| P-03 | Configurable projection horizon (1–20 years, slider) | P1 |
| P-04 | On-track / At-risk indicator | P1 |
| P-05 | Configurable inflation rate (overrides Settings value inline) | P1 |
| P-06 | Table highlights years where real value falls below adjusted target | P2 |

### 6.4 Contributions

| ID | Requirement | Priority |
|----|-------------|----------|
| C-01 | Log a contribution: date, fund, amount, notes | P0 |
| C-02 | List all contributions, newest first | P0 |
| C-03 | Filter contributions by fund or date range | P1 |
| C-04 | Monthly bar chart: PHP contributed per month | P1 |
| C-05 | Monthly goal progress (if goal is set) | P2 |
| C-06 | Delete a contribution | P1 |

### 6.5 Settings

| ID | Requirement | Priority |
|----|-------------|----------|
| S-01 | Set monthly expenses (PHP) | P0 |
| S-02 | Set target months (3 / 6 / 12 / custom) | P0 |
| S-03 | Set medical buffer (PHP) | P0 |
| S-04 | Set global inflation rate % | P0 |
| S-05 | Set optional monthly contribution goal | P2 |
| S-06 | Connect / disconnect Google Sheets (OAuth) | P1 |
| S-07 | Push to Sheets (manual trigger) | P1 |
| S-08 | Pull from Sheets (import) | P1 |
| S-09 | Show last synced timestamp | P1 |
| S-10 | Reset all data (with confirmation) | P1 |

---

## 7. Google Sheets Sync

### Sheet structure (written by the app)

**Tab: Funds**
| id | name | type | balance | expectedReturnPct | updatedAt | notes |

**Tab: Contributions**
| id | fundId | fundName | amount | date | notes |

**Tab: Settings**
| key | value |
(key-value pairs for all Settings fields)

### Sync rules
- Push always overwrites the three tabs entirely (full replace, not append).
- Pull replaces localStorage with sheet data; user is warned before overwriting.
- Sync never deletes the spreadsheet or other tabs not managed by the app.

---

## 8. Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Components | shadcn/ui | latest |
| Charts | Recharts | 2.x |
| State management | Zustand | 4.x |
| Persistence | localStorage via custom Zustand middleware | — |
| Google Auth | Google Identity Services (`@googleapis/sheets`) | — |
| Deployment | Vercel | — |

---

## 9. Non-functional Requirements

| Requirement | Target |
|-------------|--------|
| Initial load time | < 2 s on a 4G connection |
| Works offline | Yes — localStorage data available without network |
| Mobile layout | Usable on 375 px viewport (iPhone SE width) |
| Accessibility | WCAG 2.1 AA for core flows |
| Data privacy | No data leaves the browser except via explicit Sheets sync |

---

## 10. Acceptance Criteria (Phase 1 MVP)

- [ ] User can set monthly expenses, target months, and medical buffer; target is computed and displayed.
- [ ] User can add at least one fund of each type (cash, stocks/ETF, UITF, MP2) and see their total.
- [ ] Dashboard shows correct progress bar and gap against the computed target.
- [ ] All data survives a page refresh (localStorage persistence).
- [ ] App is usable on a 375 px mobile viewport without horizontal scroll.

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| Emergency fund | Liquid or near-liquid savings reserved for unexpected expenses (job loss, medical, urgent repairs). |
| MP2 | Pag-IBIG Fund Modified Pag-IBIG 2 — voluntary government savings; historically ~7% annual dividend; 5-year lock-in. |
| UITF | Unit Investment Trust Fund — pooled investment managed by a bank trust department. |
| Nominal value | Face peso amount, not adjusted for inflation. |
| Real value | Purchasing power of an amount expressed in today's pesos (nominal ÷ cumulative inflation factor). |
| Weighted return | Blended annual return across all funds, weighted by their share of total balance. |
