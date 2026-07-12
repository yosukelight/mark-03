'use client';

import { useStore } from '@/lib/store';
import { formatPHP } from '@/lib/calculations';
import { contributionsInMonth, currentMonthKey, monthLabel } from '@/lib/contributions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { QuickAddContribution } from '@/components/contributions/QuickAddContribution';
import { MonthlyBarChart } from '@/components/contributions/MonthlyBarChart';
import { ContributionHistory } from '@/components/contributions/ContributionHistory';

export default function ContributionsPage() {
  const contributions = useStore((s) => s.contributions);
  const settings = useStore((s) => s.settings);

  const goal = settings.monthlyContributionGoal ?? 0;
  const monthKey = currentMonthKey();
  const thisMonthTotal = contributionsInMonth(contributions, monthKey);

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">
            Contributions
          </h2>
          <p className="mt-1 text-sm text-slate-400">Log deposits and track your saving habit</p>
        </div>
        <QuickAddContribution />
      </div>

      {goal > 0 && (
        <Card>
          <CardContent className="p-6">
            <ProgressBar
              progressPct={(thisMonthTotal / goal) * 100}
              label={`${monthLabel(monthKey)}: ${formatPHP(thisMonthTotal)} of ${formatPHP(goal)} goal`}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] text-slate-900">Monthly contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart contributions={contributions} goal={goal > 0 ? goal : undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] text-slate-900">History</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionHistory />
        </CardContent>
      </Card>
    </div>
  );
}
