'use client';

import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FundCard } from './FundCard';
import { FundForm } from './FundForm';
import { useStore } from '@/lib/store';
import { formatPHP } from '@/lib/calculations';
import type { Fund } from '@/lib/types';

export function FundList() {
  const funds = useStore((s) => s.funds);
  const addFund = useStore((s) => s.addFund);
  const updateFund = useStore((s) => s.updateFund);
  const deleteFund = useStore((s) => s.deleteFund);
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = funds.reduce((s, f) => s + f.balance, 0);

  function getSharePct(fund: Fund) {
    return totalBalance > 0 ? (fund.balance / totalBalance) * 100 : 0;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">Your funds</h3>
          {funds.length > 0 && (
            <p className="mt-0.5 text-sm text-slate-400">
              Total <span className="font-medium text-slate-600">{formatPHP(totalBalance)}</span>
            </p>
          )}
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add fund
        </Button>
      </div>

      {funds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <Wallet className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-600">No funds yet</p>
          <p className="mb-5 mt-1 text-xs text-slate-400">
            Add your first fund to start tracking
          </p>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add your first fund
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {funds.map((fund) => (
            <FundCard
              key={fund.id}
              fund={fund}
              sharePct={getSharePct(fund)}
              onUpdate={(updates) => updateFund(fund.id, updates)}
              onDelete={() => deleteFund(fund.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add fund</DialogTitle>
            <DialogDescription>
              Add a new fund to track in your emergency fund portfolio.
            </DialogDescription>
          </DialogHeader>
          <FundForm
            submitLabel="Add fund"
            onSubmit={(values) => {
              addFund(values);
              setAddOpen(false);
            }}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
