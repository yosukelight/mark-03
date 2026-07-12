'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { buildMonthlySeries } from '@/lib/contributions';
import { formatPHP } from '@/lib/calculations';
import type { Contribution } from '@/lib/types';

interface MonthlyBarChartProps {
  contributions: Contribution[];
  /** Optional monthly goal, drawn as a dashed reference line. */
  goal?: number;
}

export function MonthlyBarChart({ contributions, goal }: MonthlyBarChartProps) {
  const data = buildMonthlySeries(contributions, 12).map((m) => ({
    month: m.label,
    Contributed: Math.round(m.total),
  }));
  const hasAny = data.some((d) => d.Contributed > 0);

  if (!hasAny) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        No contributions in the last 12 months
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => v.split(' ')[0]}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) =>
            v >= 1_000_000 ? `₱${(v / 1_000_000).toFixed(1)}M` : `₱${(v / 1_000).toFixed(0)}k`
          }
        />
        <Tooltip formatter={(value) => [formatPHP(Number(value)), '']} />
        <Bar dataKey="Contributed" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={36} />
        {goal ? <ReferenceLine y={goal} stroke="#f59e0b" strokeDasharray="4 4" /> : null}
      </BarChart>
    </ResponsiveContainer>
  );
}
