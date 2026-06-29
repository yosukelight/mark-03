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
import { FUND_TYPE_LABELS, type Fund, type FundType } from '@/lib/types';

interface FundFormProps {
  initialValues?: Partial<Fund>;
  onSubmit: (values: Omit<Fund, 'id' | 'updatedAt'>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const FUND_TYPES = Object.entries(FUND_TYPE_LABELS) as [FundType, string][];

export function FundForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: FundFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [type, setType] = useState<FundType>(initialValues?.type ?? 'cash');
  const [balance, setBalance] = useState(String(initialValues?.balance ?? ''));
  const [expectedReturnPct, setExpectedReturnPct] = useState(
    String(initialValues?.expectedReturnPct ?? ''),
  );
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    const bal = parseFloat(balance);
    if (isNaN(bal) || bal < 0) errs.balance = 'Balance must be a non-negative number';
    const ret = parseFloat(expectedReturnPct);
    if (isNaN(ret) || ret < 0 || ret > 100)
      errs.expectedReturnPct = 'Expected return must be between 0 and 100';
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
      name: name.trim(),
      type,
      balance: parseFloat(balance),
      expectedReturnPct: parseFloat(expectedReturnPct),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="fund-name">Fund name</Label>
        <Input
          id="fund-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. BDO UITF Balanced"
          aria-describedby={errors.name ? 'fund-name-error' : undefined}
        />
        {errors.name && (
          <p id="fund-name-error" className="text-xs text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fund-type">Fund type</Label>
        <Select value={type} onValueChange={(v) => setType(v as FundType)}>
          <SelectTrigger id="fund-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FUND_TYPES.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fund-balance">Current balance (PHP)</Label>
        <Input
          id="fund-balance"
          type="number"
          min="0"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0.00"
          aria-describedby={errors.balance ? 'fund-balance-error' : undefined}
        />
        {errors.balance && (
          <p id="fund-balance-error" className="text-xs text-red-600" role="alert">
            {errors.balance}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fund-return">Expected annual return (%)</Label>
        <Input
          id="fund-return"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={expectedReturnPct}
          onChange={(e) => setExpectedReturnPct(e.target.value)}
          placeholder="e.g. 7"
          aria-describedby={errors.expectedReturnPct ? 'fund-return-error' : undefined}
        />
        {errors.expectedReturnPct && (
          <p id="fund-return-error" className="text-xs text-red-600" role="alert">
            {errors.expectedReturnPct}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fund-notes">Notes (optional)</Label>
        <Textarea
          id="fund-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Pag-IBIG MP2, opened Jan 2025"
          rows={2}
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
