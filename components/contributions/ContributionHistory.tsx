'use client';

import { useMemo, useState } from 'react';
import { Coins, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { formatPHP } from '@/lib/calculations';
import { filterContributions, formatDateLabel, groupByMonth } from '@/lib/contributions';
import { FUND_TYPE_COLORS, type Contribution } from '@/lib/types';

export function ContributionHistory() {
  const contributions = useStore((s) => s.contributions);
  const funds = useStore((s) => s.funds);
  const deleteContribution = useStore((s) => s.deleteContribution);

  const [fundFilter, setFundFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState<Contribution | null>(null);

  const months = useMemo(() => groupByMonth(contributions).reverse(), [contributions]);

  const filtered = useMemo(
    () =>
      filterContributions(contributions, {
        fundId: fundFilter === 'all' ? undefined : fundFilter,
        monthKey: monthFilter === 'all' ? undefined : monthFilter,
      })
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date)),
    [contributions, fundFilter, monthFilter],
  );

  const total = filtered.reduce((s, c) => s + c.amount, 0);
  const fundOf = (id: string) => funds.find((f) => f.id === id);

  if (contributions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <Coins className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-slate-600">No contributions yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Use “Log contribution” to record your first deposit
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={fundFilter} onValueChange={setFundFilter}>
          <SelectTrigger className="w-44" aria-label="Filter by fund">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All funds</SelectItem>
            {funds.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-40" aria-label="Filter by month">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m.key} value={m.key}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="ml-auto text-sm text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} ·{' '}
          <span className="font-medium text-slate-600">{formatPHP(total)}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Date
              </th>
              <th className="py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Fund
              </th>
              <th className="py-2.5 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                Amount
              </th>
              <th className="py-2.5 pl-6 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Notes
              </th>
              <th className="w-10 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                  No contributions match these filters
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const fund = fundOf(c.fundId);
                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="whitespace-nowrap py-2.5 text-slate-600">
                      {formatDateLabel(c.date)}
                    </td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: fund ? FUND_TYPE_COLORS[fund.type] : '#cbd5e1',
                          }}
                          aria-hidden="true"
                        />
                        <span className="font-medium text-slate-800">
                          {fund?.name ?? 'Deleted fund'}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium tabular-nums text-slate-900">
                      {formatPHP(c.amount)}
                    </td>
                    <td
                      className="max-w-[220px] truncate py-2.5 pl-6 text-slate-400"
                      title={c.notes}
                    >
                      {c.notes ?? '—'}
                    </td>
                    <td className="py-1 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-300 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete contribution of ${formatPHP(c.amount)} on ${formatDateLabel(c.date)}`}
                        onClick={() => setPendingDelete(c)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete contribution</DialogTitle>
            <DialogDescription>
              Delete the {pendingDelete ? formatPHP(pendingDelete.amount) : ''} contribution from{' '}
              {pendingDelete ? formatDateLabel(pendingDelete.date) : ''}? The fund balance will not
              be changed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete) deleteContribution(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
