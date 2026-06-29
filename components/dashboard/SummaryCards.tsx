import { Card, CardContent } from '@/components/ui/card';
import { formatPHP, formatPercent } from '@/lib/calculations';
import type { Summary } from '@/lib/types';
import { TrendingUp, Target, AlertCircle, Clock } from 'lucide-react';

interface SummaryCardsProps {
  summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { totalSaved, target, gap, progressPct, monthsCovered } = summary;
  const overfunded = gap <= 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Saved</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatPHP(totalSaved)}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Target</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatPHP(target)}</p>
            </div>
            <Target className="h-5 w-5 text-blue-500" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{overfunded ? 'Overfunded' : 'Gap'}</p>
              <p
                className={`mt-1 text-2xl font-bold ${overfunded ? 'text-green-600' : 'text-red-600'}`}
              >
                {formatPHP(Math.abs(gap))}
              </p>
            </div>
            <AlertCircle
              className={`h-5 w-5 ${overfunded ? 'text-green-500' : 'text-red-400'}`}
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Months Covered</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {monthsCovered.toFixed(1)}
                <span className="text-base font-normal text-gray-500"> mo</span>
              </p>
              <p className="text-xs text-gray-400">{formatPercent(progressPct)} of target</p>
            </div>
            <Clock className="h-5 w-5 text-purple-500" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
