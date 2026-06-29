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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projections</h2>
          <p className="text-sm text-gray-500 mt-0.5">
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
        <span className="text-sm text-gray-500">years</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Year-over-year chart</CardTitle>
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
          <CardTitle className="text-base">Year-over-year table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-left font-medium text-gray-500">Year</th>
                  <th className="py-2 text-right font-medium text-blue-600">Nominal</th>
                  <th className="py-2 text-right font-medium text-green-600">Real</th>
                  <th className="py-2 text-right font-medium text-red-500">Target (real)</th>
                  <th className="py-2 text-center font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.year}
                    className={cn(
                      'border-b border-gray-50',
                      !row.onTrack && 'bg-red-50',
                    )}
                  >
                    <td className="py-2 font-medium">{row.year}</td>
                    <td className="py-2 text-right">{formatPHP(row.nominalValue)}</td>
                    <td className="py-2 text-right">{formatPHP(row.realValue)}</td>
                    <td className="py-2 text-right">{formatPHP(row.targetReal)}</td>
                    <td className="py-2 text-center">
                      <Badge variant={row.onTrack ? 'success' : 'warning'} className="text-xs">
                        {row.onTrack ? 'OK' : 'Gap'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Inflation rate: {formatPercent(settings.inflationRatePct)} · Change in{' '}
            <a href="/settings" className="underline">
              Settings
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
