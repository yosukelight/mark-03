'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { buildProjections, formatPHP, formatPercent } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function ProjectionsPage() {
  const funds = useStore((s) => s.funds);
  const settings = useStore((s) => s.settings);
  const [horizon, setHorizon] = useState(10);

  const rows = buildProjections(funds, settings, horizon);
  const allOnTrack = rows.every((r) => r.onTrack);
  const someOffTrack = rows.some((r) => !r.onTrack);

  const chartData = rows.map((r) => ({
    year: r.year,
    Nominal: Math.round(r.nominalValue),
    Real: Math.round(r.realValue),
    Target: Math.round(r.targetReal),
  }));

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">Projections</h2>
          <p className="mt-1 text-sm text-slate-400">
            Nominal vs. real purchasing power over time
          </p>
        </div>
        <Badge variant={allOnTrack ? 'success' : someOffTrack ? 'warning' : 'secondary'}>
          {allOnTrack ? 'On track' : 'At risk'}
        </Badge>
      </div>

      <div className="flex items-center gap-3 max-w-xs">
        <Label htmlFor="horizon" className="shrink-0">
          Horizon:
        </Label>
        <Input
          id="horizon"
          type="number"
          min={1}
          max={20}
          value={horizon}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v >= 1 && v <= 20) setHorizon(v);
          }}
          className="w-20"
        />
        <span className="text-sm text-slate-400">years</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] text-slate-900">Year-over-year chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `₱${(v / 1_000_000).toFixed(1)}M`
                    : `₱${(v / 1_000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(value) => [formatPHP(Number(value)), '']}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="Nominal" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Real" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="Target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] text-slate-900">Year-over-year table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">Year</th>
                  <th className="py-2.5 text-right text-xs font-medium uppercase tracking-wide text-blue-600">Nominal</th>
                  <th className="py-2.5 text-right text-xs font-medium uppercase tracking-wide text-emerald-600">Real</th>
                  <th className="py-2.5 text-right text-xs font-medium uppercase tracking-wide text-red-500">Target (real)</th>
                  <th className="py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.year}
                    className={cn(
                      'border-b border-slate-50 transition-colors',
                      row.onTrack ? 'hover:bg-slate-50/60' : 'bg-red-50/60',
                    )}
                  >
                    <td className="py-2.5 font-medium text-slate-700">{row.year}</td>
                    <td className="py-2.5 text-right tabular-nums text-slate-600">{formatPHP(row.nominalValue)}</td>
                    <td className="py-2.5 text-right tabular-nums text-slate-600">{formatPHP(row.realValue)}</td>
                    <td className="py-2.5 text-right tabular-nums text-slate-600">{formatPHP(row.targetReal)}</td>
                    <td className="py-2.5 text-center">
                      <Badge variant={row.onTrack ? 'success' : 'warning'} className="text-xs">
                        {row.onTrack ? 'OK' : 'Gap'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Inflation rate: {formatPercent(settings.inflationRatePct)} · Change in{' '}
            <a href="/settings" className="font-medium text-indigo-600 underline-offset-2 hover:underline">
              Settings
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
