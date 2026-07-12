'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ContributionForm, type ContributionFormValues } from './ContributionForm';
import { useStore } from '@/lib/store';

interface QuickAddContributionProps {
  label?: string;
  size?: 'sm' | 'default';
}

export function QuickAddContribution({
  label = 'Log contribution',
  size = 'sm',
}: QuickAddContributionProps) {
  const funds = useStore((s) => s.funds);
  const addContribution = useStore((s) => s.addContribution);
  const updateFund = useStore((s) => s.updateFund);
  const [open, setOpen] = useState(false);

  function handleSubmit(values: ContributionFormValues) {
    const { applyToBalance, ...contribution } = values;
    addContribution(contribution);
    if (applyToBalance) {
      // Read fresh state so the balance increment never uses a stale closure.
      const fund = useStore.getState().funds.find((f) => f.id === contribution.fundId);
      if (fund) updateFund(fund.id, { balance: fund.balance + contribution.amount });
    }
    setOpen(false);
  }

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log contribution</DialogTitle>
            <DialogDescription>Record a deposit to one of your funds.</DialogDescription>
          </DialogHeader>
          {funds.length === 0 ? (
            <div className="space-y-4 pt-1">
              <p className="text-sm text-slate-500">
                You need at least one fund before logging a contribution.
              </p>
              <Button asChild size="sm">
                <Link href="/funds">Go to Funds</Link>
              </Button>
            </div>
          ) : (
            <ContributionForm
              funds={funds}
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
