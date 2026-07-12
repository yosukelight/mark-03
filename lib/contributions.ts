import type { Contribution } from './types';

export interface MonthlyTotal {
  /** 'YYYY-MM' */
  key: string;
  /** e.g. 'Jul 2026' */
  label: string;
  total: number;
}

/** Local-timezone ISO date (YYYY-MM-DD). Avoids the UTC shift of toISOString(). */
export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function monthKeyOf(date: string): string {
  return date.slice(0, 7);
}

export function currentMonthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m || m < 1 || m > 12) return key;
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Totals per month for months that have contributions, ascending by month. */
export function groupByMonth(contributions: Contribution[]): MonthlyTotal[] {
  const totals = new Map<string, number>();
  for (const c of contributions) {
    const key = monthKeyOf(c.date);
    totals.set(key, (totals.get(key) ?? 0) + c.amount);
  }
  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => ({ key, label: monthLabel(key), total }));
}

/**
 * Continuous series of the last `months` calendar months (oldest first),
 * zero-filled for months without contributions. Used by the bar chart.
 */
export function buildMonthlySeries(
  contributions: Contribution[],
  months = 12,
  now = new Date(),
): MonthlyTotal[] {
  const totals = new Map<string, number>();
  for (const c of contributions) {
    const key = monthKeyOf(c.date);
    totals.set(key, (totals.get(key) ?? 0) + c.amount);
  }
  const series: MonthlyTotal[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    series.push({ key, label: monthLabel(key), total: totals.get(key) ?? 0 });
  }
  return series;
}

export function contributionsInMonth(contributions: Contribution[], key: string): number {
  return contributions
    .filter((c) => monthKeyOf(c.date) === key)
    .reduce((sum, c) => sum + c.amount, 0);
}

export interface ContributionFilter {
  fundId?: string;
  monthKey?: string;
}

export function filterContributions(
  contributions: Contribution[],
  filter: ContributionFilter = {},
): Contribution[] {
  return contributions.filter((c) => {
    if (filter.fundId && c.fundId !== filter.fundId) return false;
    if (filter.monthKey && monthKeyOf(c.date) !== filter.monthKey) return false;
    return true;
  });
}
