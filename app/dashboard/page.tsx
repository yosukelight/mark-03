'use client';

import { useStore } from '@/lib/store';
import { computeSummary } from '@/lib/calculations';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { FundDonutChart } from '@/components/dashboard/FundDonutChart';
import { QuickAddContribution } from '@/components/contributions/QuickAddContribution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

export default function DashboardPage() {
  const funds = useStore((s) => s.funds);
  const settings = useStore((s) => s.settings);
  const summary = computeSummary(funds, settings);
  const needsSetup = settings.monthlyExpenses === 0;

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Your emergency fund at a glance</p>
        </div>
        <QuickAddContribution />
      </div>

      {needsSetup && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="font-semibold">Setup required.</strong> Configure your monthly
            expenses and target to see accurate progress.
          </div>
          <Button size="sm" variant="outline" asChild className="shrink-0">
            <Link href="/settings">
              <Settings2 className="h-4 w-4" />
              Go to Settings
            </Link>
          </Button>
        </div>
      )}

      <SummaryCards summary={summary} />

      <Card>
        <CardContent className="p-6">
          <ProgressBar progressPct={summary.progressPct} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[15px] text-slate-900">Fund breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <FundDonutChart funds={funds} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[15px] text-slate-900">Target details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly expenses</span>
              <span className="font-medium text-slate-700">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                  settings.monthlyExpenses,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target months</span>
              <span className="font-medium text-slate-700">{settings.targetMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Medical buffer</span>
              <span className="font-medium text-slate-700">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                  settings.medicalBuffer,
                )}
              </span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Total target</span>
              <span className="text-indigo-600">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                  summary.target,
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
