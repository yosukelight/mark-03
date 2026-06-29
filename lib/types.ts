export type FundType = 'cash' | 'stocks_etf' | 'mutual_fund_uitf' | 'mp2';

export const FUND_TYPE_LABELS: Record<FundType, string> = {
  cash: 'Cash Savings',
  stocks_etf: 'Stocks / ETFs',
  mutual_fund_uitf: 'Mutual Fund / UITF',
  mp2: 'MP2 (Pag-IBIG)',
};

export const FUND_TYPE_COLORS: Record<FundType, string> = {
  cash: '#22c55e',
  stocks_etf: '#3b82f6',
  mutual_fund_uitf: '#a855f7',
  mp2: '#f59e0b',
};

export interface Fund {
  id: string;
  name: string;
  type: FundType;
  balance: number;
  expectedReturnPct: number;
  updatedAt: string;
  notes?: string;
}

export interface Contribution {
  id: string;
  fundId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Settings {
  monthlyExpenses: number;
  targetMonths: number;
  medicalBuffer: number;
  inflationRatePct: number;
  monthlyContributionGoal?: number;
  sheetsSpreadsheetId?: string;
  sheetsLastSyncedAt?: string;
}

export interface Summary {
  totalSaved: number;
  target: number;
  gap: number;
  progressPct: number;
  monthsCovered: number;
}

export const DEFAULT_SETTINGS: Settings = {
  monthlyExpenses: 0,
  targetMonths: 6,
  medicalBuffer: 0,
  inflationRatePct: 4.0,
};
