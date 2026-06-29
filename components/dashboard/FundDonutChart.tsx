'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FUND_TYPE_COLORS, FUND_TYPE_LABELS, type Fund } from '@/lib/types';
import { formatPHP } from '@/lib/calculations';

interface FundDonutChartProps {
  funds: Fund[];
}

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function FundDonutChart({ funds }: FundDonutChartProps) {
  if (funds.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        No funds added yet
      </div>
    );
  }

  const grouped: Record<string, number> = {};
  for (const fund of funds) {
    grouped[fund.type] = (grouped[fund.type] ?? 0) + fund.balance;
  }

  const data: ChartEntry[] = Object.entries(grouped)
    .filter(([, v]) => v > 0)
    .map(([type, value]) => ({
      name: FUND_TYPE_LABELS[type as keyof typeof FUND_TYPE_LABELS],
      value,
      color: FUND_TYPE_COLORS[type as keyof typeof FUND_TYPE_COLORS],
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        All fund balances are zero
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatPHP(Number(value)), 'Balance']}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
