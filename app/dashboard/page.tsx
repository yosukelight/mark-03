'use client';

import { useStore } from '@/lib/store';
import { computeSummary } from '@/lib/calculations';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { FundDonutChart } from '@/components/dashboard/FundDonutChart';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your emergency fund at a glance</p>
        </div>
      </div>

      {needsSetup && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Setup required:</strong> Configure your monthly expenses and target in{' '}
          <Link href="/settings" className="underline font-medium">
            Settings
          </Link>{' '}
          to see accurate progress.
          <div className="mt-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/settings">
                <Settings2 className="h-4 w-4" />
                Go to Settings
              </Link>
            </Button>
          </div>
        </div>
      )}

      <SummaryCards summary={summary} />

      <Card>
        <CardContent className="pt-6">
          <ProgressBar progressPct={summary.progressPct} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fund breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <FundDonutChart funds={funds} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Target details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly expenses</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                  settings.monthlyExpenses,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target months</span>
              <span className="font-medium">{settings.targetMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Medical buffer</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
                  settings.medicalBuffer,
                )}
              </span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">Total target</span>
              <span className="text-blue-600">
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
