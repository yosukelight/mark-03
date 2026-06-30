import { Card, CardContent } from '@/components/ui/card';
import { formatPHP, formatPercent } from '@/lib/calculations';
import type { Summary } from '@/lib/types';
import { TrendingUp, Target, AlertCircle, Clock, type LucideIcon } from 'lucide-react';

interface SummaryCardsProps {
  summary: Summary;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tint: string;
  valueClass?: string;
  unit?: string;
  subtitle?: string;
}

function StatCard({ label, value, icon: Icon, tint, valueClass, unit, subtitle }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-[0_4px_16px_-4px_rgb(0_0_0_/_0.08)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueClass ?? 'text-slate-900'}`}>
              {value}
              {unit && <span className="text-base font-normal text-slate-400"> {unit}</span>}
            </p>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tint}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { totalSaved, target, gap, progressPct, monthsCovered } = summary;
  const overfunded = gap <= 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Saved"
        value={formatPHP(totalSaved)}
        icon={TrendingUp}
        tint="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        label="Target"
        value={formatPHP(target)}
        icon={Target}
        tint="bg-indigo-50 text-indigo-600"
      />
      <StatCard
        label={overfunded ? 'Overfunded' : 'Gap'}
        value={formatPHP(Math.abs(gap))}
        icon={AlertCircle}
        tint={overfunded ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}
        valueClass={overfunded ? 'text-emerald-600' : 'text-red-600'}
      />
      <StatCard
        label="Months Covered"
        value={monthsCovered.toFixed(1)}
        unit="mo"
        icon={Clock}
        tint="bg-violet-50 text-violet-600"
        subtitle={`${formatPercent(progressPct)} of target`}
      />
    </div>
  );
}
