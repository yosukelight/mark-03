import {
  todayISO,
  monthKeyOf,
  currentMonthKey,
  monthLabel,
  formatDateLabel,
  groupByMonth,
  buildMonthlySeries,
  contributionsInMonth,
  filterContributions,
} from '@/lib/contributions';
import type { Contribution } from '@/lib/types';

const makeContribution = (overrides: Partial<Contribution> = {}): Contribution => ({
  id: '1',
  fundId: 'f1',
  amount: 1_000,
  date: '2026-07-10',
  ...overrides,
});

describe('todayISO', () => {
  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('uses local date parts, not UTC', () => {
    expect(todayISO(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });
});

describe('monthKeyOf', () => {
  it('extracts YYYY-MM from an ISO date', () => {
    expect(monthKeyOf('2026-07-10')).toBe('2026-07');
  });
});

describe('currentMonthKey', () => {
  it('formats the month with zero padding', () => {
    expect(currentMonthKey(new Date(2026, 0, 15))).toBe('2026-01');
    expect(currentMonthKey(new Date(2026, 11, 31))).toBe('2026-12');
  });
});

describe('monthLabel', () => {
  it('formats a month key as a short label', () => {
    expect(monthLabel('2026-07')).toBe('Jul 2026');
  });

  it('returns the input unchanged when unparseable', () => {
    expect(monthLabel('bogus')).toBe('bogus');
  });
});

describe('formatDateLabel', () => {
  it('formats an ISO date as a readable label', () => {
    expect(formatDateLabel('2026-07-10')).toBe('Jul 10, 2026');
  });

  it('returns the input unchanged when unparseable', () => {
    expect(formatDateLabel('not-a-date')).toBe('not-a-date');
  });
});

describe('groupByMonth', () => {
  it('returns empty array for no contributions', () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it('sums amounts per month', () => {
    const list = [
      makeContribution({ id: '1', date: '2026-07-01', amount: 1_000 }),
      makeContribution({ id: '2', date: '2026-07-20', amount: 2_000 }),
      makeContribution({ id: '3', date: '2026-06-15', amount: 500 }),
    ];
    const grouped = groupByMonth(list);
    expect(grouped).toHaveLength(2);
    expect(grouped[1]).toEqual({ key: '2026-07', label: 'Jul 2026', total: 3_000 });
  });

  it('sorts months ascending', () => {
    const list = [
      makeContribution({ id: '1', date: '2026-07-01' }),
      makeContribution({ id: '2', date: '2025-12-01' }),
      makeContribution({ id: '3', date: '2026-03-01' }),
    ];
    expect(groupByMonth(list).map((m) => m.key)).toEqual(['2025-12', '2026-03', '2026-07']);
  });
});

describe('buildMonthlySeries', () => {
  const now = new Date(2026, 6, 15); // July 2026

  it('returns 12 months by default', () => {
    expect(buildMonthlySeries([], 12, now)).toHaveLength(12);
  });

  it('produces consecutive months ending at the current month', () => {
    const series = buildMonthlySeries([], 3, now);
    expect(series.map((m) => m.key)).toEqual(['2026-05', '2026-06', '2026-07']);
  });

  it('zero-fills months without contributions', () => {
    const list = [makeContribution({ date: '2026-06-10', amount: 4_000 })];
    const series = buildMonthlySeries(list, 3, now);
    expect(series.map((m) => m.total)).toEqual([0, 4_000, 0]);
  });

  it('sums multiple contributions within a month', () => {
    const list = [
      makeContribution({ id: '1', date: '2026-07-01', amount: 1_500 }),
      makeContribution({ id: '2', date: '2026-07-31', amount: 500 }),
    ];
    const series = buildMonthlySeries(list, 2, now);
    expect(series[1].total).toBe(2_000);
  });

  it('ignores contributions outside the window', () => {
    const list = [makeContribution({ date: '2024-01-01', amount: 9_999 })];
    const series = buildMonthlySeries(list, 12, now);
    expect(series.every((m) => m.total === 0)).toBe(true);
  });

  it('spans a year boundary correctly', () => {
    const series = buildMonthlySeries([], 3, new Date(2026, 0, 10)); // Jan 2026
    expect(series.map((m) => m.key)).toEqual(['2025-11', '2025-12', '2026-01']);
  });
});

describe('contributionsInMonth', () => {
  const list = [
    makeContribution({ id: '1', date: '2026-07-01', amount: 1_000 }),
    makeContribution({ id: '2', date: '2026-07-20', amount: 2_500 }),
    makeContribution({ id: '3', date: '2026-06-30', amount: 700 }),
  ];

  it('sums only the matching month', () => {
    expect(contributionsInMonth(list, '2026-07')).toBe(3_500);
  });

  it('returns 0 when nothing matches', () => {
    expect(contributionsInMonth(list, '2026-01')).toBe(0);
  });
});

describe('filterContributions', () => {
  const list = [
    makeContribution({ id: '1', fundId: 'f1', date: '2026-07-01' }),
    makeContribution({ id: '2', fundId: 'f2', date: '2026-07-15' }),
    makeContribution({ id: '3', fundId: 'f1', date: '2026-06-10' }),
  ];

  it('returns everything with no filter', () => {
    expect(filterContributions(list)).toHaveLength(3);
  });

  it('filters by fund', () => {
    const out = filterContributions(list, { fundId: 'f1' });
    expect(out.map((c) => c.id)).toEqual(['1', '3']);
  });

  it('filters by month', () => {
    const out = filterContributions(list, { monthKey: '2026-07' });
    expect(out.map((c) => c.id)).toEqual(['1', '2']);
  });

  it('combines fund and month filters', () => {
    const out = filterContributions(list, { fundId: 'f1', monthKey: '2026-07' });
    expect(out.map((c) => c.id)).toEqual(['1']);
  });

  it('returns empty when nothing matches', () => {
    expect(filterContributions(list, { fundId: 'nope' })).toEqual([]);
  });
});
