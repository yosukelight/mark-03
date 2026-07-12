'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { todayISO } from '@/lib/contributions';
import type { Fund } from '@/lib/types';

export interface ContributionFormValues {
  fundId: string;
  amount: number;
  date: string;
  notes?: string;
  /** When true, the amount is also added to the fund's balance. */
  applyToBalance: boolean;
}

interface ContributionFormProps {
  funds: Fund[];
  onSubmit: (values: ContributionFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ContributionForm({
  funds,
  onSubmit,
  onCancel,
  submitLabel = 'Log contribution',
}: ContributionFormProps) {
  const [fundId, setFundId] = useState(funds[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState('');
  const [applyToBalance, setApplyToBalance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!fundId) errs.fundId = 'Select a fund';
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) errs.amount = 'Amount must be greater than 0';
    if (!date) errs.date = 'Date is required';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      fundId,
      amount: parseFloat(amount),
      date,
      notes: notes.trim() || undefined,
      applyToBalance,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="contrib-fund">Fund</Label>
        <Select value={fundId} onValueChange={setFundId}>
          <SelectTrigger id="contrib-fund">
            <SelectValue placeholder="Select a fund" />
          </SelectTrigger>
          <SelectContent>
            {funds.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fundId && (
          <p className="text-xs text-red-600" role="alert">
            {errors.fundId}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contrib-amount">Amount (PHP)</Label>
        <Input
          id="contrib-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
          aria-describedby={errors.amount ? 'contrib-amount-error' : undefined}
        />
        {errors.amount && (
          <p id="contrib-amount-error" className="text-xs text-red-600" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contrib-date">Date</Label>
        <Input
          id="contrib-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-describedby={errors.date ? 'contrib-date-error' : undefined}
        />
        {errors.date && (
          <p id="contrib-date-error" className="text-xs text-red-600" role="alert">
            {errors.date}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contrib-notes">Notes (optional)</Label>
        <Textarea
          id="contrib-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. 13th month pay"
          rows={2}
        />
      </div>

      <label
        htmlFor="contrib-apply"
        className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600"
      >
        <input
          id="contrib-apply"
          type="checkbox"
          checked={applyToBalance}
          onChange={(e) => setApplyToBalance(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
        />
        Add amount to the fund&apos;s balance
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
