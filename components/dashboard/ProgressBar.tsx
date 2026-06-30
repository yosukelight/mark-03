import { formatPercent } from '@/lib/calculations';

interface ProgressBarProps {
  progressPct: number;
  label?: string;
}

export function ProgressBar({ progressPct, label }: ProgressBarProps) {
  const pct = Math.min(Math.max(progressPct, 0), 100);
  const color =
    pct >= 100 ? 'bg-green-500' : pct >= 75 ? 'bg-blue-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label ?? 'Progress to target'}</span>
        <span className="text-sm font-semibold tabular-nums text-slate-900">{formatPercent(pct)}</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress to target'}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
