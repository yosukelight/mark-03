import {
  computeSummary,
  weightedReturn,
  buildProjections,
  formatPHP,
  formatPercent,
} from '@/lib/calculations';
import type { Fund, Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/types';

const baseSettings: Settings = {
  ...DEFAULT_SETTINGS,
  monthlyExpenses: 30_000,
  targetMonths: 6,
  medicalBuffer: 50_000,
  inflationRatePct: 4,
};

const makeFund = (overrides: Partial<Fund> = {}): Fund => ({
  id: '1',
  name: 'Test Fund',
  type: 'cash',
  balance: 100_000,
  expectedReturnPct: 0,
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('computeSummary', () => {
  it('computes target as (expenses × months) + medicalBuffer', () => {
    const { target } = computeSummary([], baseSettings);
    expect(target).toBe(30_000 * 6 + 50_000); // 230_000
  });

  it('sums all fund balances for totalSaved', () => {
    const funds = [makeFund({ balance: 100_000 }), makeFund({ id: '2', balance: 50_000 })];
    const { totalSaved } = computeSummary(funds, baseSettings);
    expect(totalSaved).toBe(150_000);
  });

  it('gap is target minus totalSaved', () => {
    const funds = [makeFund({ balance: 100_000 })];
    const { gap } = computeSummary(funds, baseSettings);
    expect(gap).toBe(230_000 - 100_000);
  });

  it('gap is negative when overfunded', () => {
    const funds = [makeFund({ balance: 500_000 })];
    const { gap } = computeSummary(funds, baseSettings);
    expect(gap).toBeLessThan(0);
  });

  it('progressPct is 0 when target is 0', () => {
    const noTarget: Settings = { ...baseSettings, monthlyExpenses: 0, medicalBuffer: 0 };
    const { progressPct } = computeSummary([makeFund({ balance: 10_000 })], noTarget);
    expect(progressPct).toBe(0);
  });

  it('progressPct caps at 100 when overfunded', () => {
    const funds = [makeFund({ balance: 999_999 })];
    const { progressPct } = computeSummary(funds, baseSettings);
    expect(progressPct).toBe(100);
  });

  it('progressPct is proportional to target', () => {
    const funds = [makeFund({ balance: 115_000 })]; // half of 230_000
    const { progressPct } = computeSummary(funds, baseSettings);
    expect(progressPct).toBeCloseTo(50, 1);
  });

  it('monthsCovered is totalSaved / monthlyExpenses', () => {
    const funds = [makeFund({ balance: 90_000 })];
    const { monthsCovered } = computeSummary(funds, baseSettings);
    expect(monthsCovered).toBeCloseTo(3, 5);
  });

  it('monthsCovered is 0 when monthlyExpenses is 0', () => {
    const s: Settings = { ...baseSettings, monthlyExpenses: 0 };
    const { monthsCovered } = computeSummary([makeFund({ balance: 50_000 })], s);
    expect(monthsCovered).toBe(0);
  });

  it('handles empty funds array', () => {
    const result = computeSummary([], baseSettings);
    expect(result.totalSaved).toBe(0);
    expect(result.gap).toBe(230_000);
    expect(result.progressPct).toBe(0);
    expect(result.monthsCovered).toBe(0);
  });
});

describe('weightedReturn', () => {
  it('returns 0 for empty fund list', () => {
    expect(weightedReturn([])).toBe(0);
  });

  it('returns 0 when all balances are zero', () => {
    const funds = [makeFund({ balance: 0, expectedReturnPct: 10 })];
    expect(weightedReturn(funds)).toBe(0);
  });

  it('returns the single fund return when only one fund', () => {
    const funds = [makeFund({ balance: 100_000, expectedReturnPct: 7 })];
    expect(weightedReturn(funds)).toBeCloseTo(0.07, 10);
  });

  it('computes weighted average for multiple funds', () => {
    const funds = [
      makeFund({ id: '1', balance: 100_000, expectedReturnPct: 4 }),
      makeFund({ id: '2', balance: 100_000, expectedReturnPct: 10 }),
    ];
    // Equal weight → average = 7%
    expect(weightedReturn(funds)).toBeCloseTo(0.07, 10);
  });

  it('weights correctly by balance proportion', () => {
    const funds = [
      makeFund({ id: '1', balance: 200_000, expectedReturnPct: 4 }),  // 2/3
      makeFund({ id: '2', balance: 100_000, expectedReturnPct: 10 }), // 1/3
    ];
    // 2/3 × 4 + 1/3 × 10 = 8/3 + 10/3 = 18/3 = 6%
    expect(weightedReturn(funds)).toBeCloseTo(0.06, 10);
  });
});

describe('buildProjections', () => {
  const funds = [makeFund({ balance: 230_000, expectedReturnPct: 4 })];

  it('returns horizon + 1 rows (year 0 through year N)', () => {
    const rows = buildProjections(funds, baseSettings, 5);
    expect(rows).toHaveLength(6);
  });

  it('year 0 nominal value equals totalSaved', () => {
    const rows = buildProjections(funds, baseSettings, 1);
    expect(rows[0].nominalValue).toBeCloseTo(230_000, 1);
  });

  it('year 0 real value equals totalSaved', () => {
    const rows = buildProjections(funds, baseSettings, 1);
    expect(rows[0].realValue).toBeCloseTo(230_000, 1);
  });

  it('year 0 targetReal equals the base target', () => {
    const rows = buildProjections(funds, baseSettings, 1);
    expect(rows[0].targetReal).toBeCloseTo(230_000, 1);
  });

  it('nominal value grows by expected return each year', () => {
    const rows = buildProjections(funds, baseSettings, 2);
    expect(rows[1].nominalValue).toBeCloseTo(230_000 * 1.04, 1);
    expect(rows[2].nominalValue).toBeCloseTo(230_000 * 1.04 ** 2, 1);
  });

  it('real value = nominalValue / inflation compound', () => {
    const rows = buildProjections(funds, baseSettings, 1);
    expect(rows[1].realValue).toBeCloseTo(rows[1].nominalValue / 1.04, 4);
  });

  it('targetReal grows by inflation each year', () => {
    const rows = buildProjections(funds, baseSettings, 2);
    expect(rows[1].targetReal).toBeCloseTo(230_000 * 1.04, 1);
    expect(rows[2].targetReal).toBeCloseTo(230_000 * 1.04 ** 2, 1);
  });

  it('onTrack when starting well above target with returns exceeding inflation', () => {
    // 5× overfunded with 8% return vs 4% inflation → real value grows faster than target
    const richFunds = [makeFund({ balance: 1_150_000, expectedReturnPct: 8 })];
    const rows = buildProjections(richFunds, baseSettings, 10);
    rows.forEach((r) => expect(r.onTrack).toBe(true));
  });

  it('year 0 is always onTrack when totalSaved >= target', () => {
    const rows = buildProjections(funds, baseSettings, 5);
    expect(rows[0].onTrack).toBe(true);
  });

  it('onTrack is false when real falls below target', () => {
    const lowReturnFunds = [makeFund({ balance: 230_000, expectedReturnPct: 0 })];
    const rows = buildProjections(lowReturnFunds, baseSettings, 5);
    // year 0 on track, subsequent years off track as inflation erodes real value
    expect(rows[0].onTrack).toBe(true);
    expect(rows[5].onTrack).toBe(false);
  });

  it('returns correct year numbers', () => {
    const currentYear = new Date().getFullYear();
    const rows = buildProjections(funds, baseSettings, 3);
    expect(rows[0].year).toBe(currentYear);
    expect(rows[3].year).toBe(currentYear + 3);
  });

  it('handles zero total saved', () => {
    const rows = buildProjections([], baseSettings, 3);
    rows.forEach((r) => expect(r.nominalValue).toBe(0));
  });
});

describe('formatPHP', () => {
  it('formats zero', () => {
    expect(formatPHP(0)).toMatch(/0\.00/);
  });

  it('includes PHP currency symbol or code', () => {
    const formatted = formatPHP(1000);
    expect(formatted).toMatch(/1,000\.00/);
  });

  it('formats large numbers with commas', () => {
    const formatted = formatPHP(1_000_000);
    expect(formatted).toMatch(/1,000,000\.00/);
  });

  it('formats negative numbers', () => {
    const formatted = formatPHP(-500);
    expect(formatted).toMatch(/500\.00/);
  });
});

describe('formatPercent', () => {
  it('formats with one decimal by default', () => {
    expect(formatPercent(50)).toBe('50.0%');
  });

  it('uses custom decimal places', () => {
    expect(formatPercent(33.333, 2)).toBe('33.33%');
  });

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats 100', () => {
    expect(formatPercent(100)).toBe('100.0%');
  });
});
