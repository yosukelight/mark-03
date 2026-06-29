import type { Fund, Settings, Summary } from './types';

export function computeSummary(funds: Fund[], settings: Settings): Summary {
  const totalSaved = funds.reduce((sum, f) => sum + f.balance, 0);
  const target =
    settings.monthlyExpenses * settings.targetMonths + settings.medicalBuffer;
  const gap = target - totalSaved;
  const progressPct = target > 0 ? Math.min((totalSaved / target) * 100, 100) : 0;
  const monthsCovered =
    settings.monthlyExpenses > 0 ? totalSaved / settings.monthlyExpenses : 0;

  return { totalSaved, target, gap, progressPct, monthsCovered };
}

export function weightedReturn(funds: Fund[]): number {
  const total = funds.reduce((s, f) => s + f.balance, 0);
  if (total === 0) return 0;
  return funds.reduce(
    (s, f) => s + (f.balance / total) * (f.expectedReturnPct / 100),
    0,
  );
}

export interface ProjectionRow {
  year: number;
  nominalValue: number;
  realValue: number;
  targetReal: number;
  onTrack: boolean;
}

export function buildProjections(
  funds: Fund[],
  settings: Settings,
  horizonYears: number,
): ProjectionRow[] {
  const totalSaved = funds.reduce((s, f) => s + f.balance, 0);
  const target =
    settings.monthlyExpenses * settings.targetMonths + settings.medicalBuffer;
  const wr = weightedReturn(funds);
  const inf = settings.inflationRatePct / 100;

  return Array.from({ length: horizonYears + 1 }, (_, n) => {
    const nominalValue = totalSaved * Math.pow(1 + wr, n);
    const realValue = nominalValue / Math.pow(1 + inf, n);
    const targetReal = target * Math.pow(1 + inf, n);
    return {
      year: new Date().getFullYear() + n,
      nominalValue,
      realValue,
      targetReal,
      onTrack: realValue >= targetReal,
    };
  });
}

export function formatPHP(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
