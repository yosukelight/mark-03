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
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label ?? 'Progress to target'}</span>
        <span className="text-sm font-semibold text-gray-900">{formatPercent(pct)}</span>
      </div>
      <div
        className="h-3 w-full rounded-full bg-gray-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress to target'}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
