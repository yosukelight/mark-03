'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const MONTH_OPTIONS = [
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months (recommended)' },
  { value: '12', label: '12 months' },
  { value: 'custom', label: 'Custom' },
];

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetAll = useStore((s) => s.resetAll);

  const presetMonths = ['3', '6', '12'];
  const isPreset = presetMonths.includes(String(settings.targetMonths));

  const [monthsMode, setMonthsMode] = useState<string>(
    isPreset ? String(settings.targetMonths) : 'custom',
  );
  const [customMonths, setCustomMonths] = useState(
    !isPreset ? String(settings.targetMonths) : '',
  );

  const [monthlyExpenses, setMonthlyExpenses] = useState(String(settings.monthlyExpenses));
  const [medicalBuffer, setMedicalBuffer] = useState(String(settings.medicalBuffer));
  const [inflationRate, setInflationRate] = useState(String(settings.inflationRatePct));
  const [saved, setSaved] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    const exp = parseFloat(monthlyExpenses);
    if (isNaN(exp) || exp < 0) errs.monthlyExpenses = 'Must be a non-negative number';
    const med = parseFloat(medicalBuffer);
    if (isNaN(med) || med < 0) errs.medicalBuffer = 'Must be a non-negative number';
    const inf = parseFloat(inflationRate);
    if (isNaN(inf) || inf < 0 || inf > 100) errs.inflationRate = 'Must be between 0 and 100';
    const months =
      monthsMode === 'custom' ? parseFloat(customMonths) : parseFloat(monthsMode);
    if (isNaN(months) || months < 1) errs.targetMonths = 'Must be at least 1 month';
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const targetMonths =
      monthsMode === 'custom' ? parseFloat(customMonths) : parseFloat(monthsMode);
    updateSettings({
      monthlyExpenses: parseFloat(monthlyExpenses),
      medicalBuffer: parseFloat(medicalBuffer),
      inflationRatePct: parseFloat(inflationRate),
      targetMonths,
    });
    setErrors({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure your emergency fund targets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency fund target</CardTitle>
          <CardDescription>
            Target = monthly expenses × months + medical buffer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="monthly-expenses">Monthly household expenses (PHP)</Label>
            <Input
              id="monthly-expenses"
              type="number"
              min="0"
              step="100"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder="e.g. 30000"
              aria-describedby={errors.monthlyExpenses ? 'monthly-expenses-error' : undefined}
            />
            {errors.monthlyExpenses && (
              <p id="monthly-expenses-error" className="text-xs text-red-600" role="alert">
                {errors.monthlyExpenses}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="target-months">Target months</Label>
            <Select
              value={monthsMode}
              onValueChange={(v) => {
                setMonthsMode(v);
                if (v !== 'custom') setCustomMonths('');
              }}
            >
              <SelectTrigger id="target-months">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {monthsMode === 'custom' && (
              <Input
                type="number"
                min="1"
                step="1"
                value={customMonths}
                onChange={(e) => setCustomMonths(e.target.value)}
                placeholder="e.g. 9"
                aria-label="Custom number of months"
                aria-describedby={errors.targetMonths ? 'target-months-error' : undefined}
              />
            )}
            {errors.targetMonths && (
              <p id="target-months-error" className="text-xs text-red-600" role="alert">
                {errors.targetMonths}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="medical-buffer">Medical buffer (PHP)</Label>
            <Input
              id="medical-buffer"
              type="number"
              min="0"
              step="1000"
              value={medicalBuffer}
              onChange={(e) => setMedicalBuffer(e.target.value)}
              placeholder="e.g. 50000"
              aria-describedby={errors.medicalBuffer ? 'medical-buffer-error' : undefined}
            />
            {errors.medicalBuffer && (
              <p id="medical-buffer-error" className="text-xs text-red-600" role="alert">
                {errors.medicalBuffer}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projection settings</CardTitle>
          <CardDescription>Used in the Projections page to model purchasing power</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inflation-rate">Annual inflation rate (%)</Label>
            <Input
              id="inflation-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="4.0"
              aria-describedby={errors.inflationRate ? 'inflation-rate-error' : undefined}
            />
            {errors.inflationRate && (
              <p id="inflation-rate-error" className="text-xs text-red-600" role="alert">
                {errors.inflationRate}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          {saved ? 'Saved!' : 'Save settings'}
        </Button>
        <Button variant="destructive" onClick={() => setResetOpen(true)}>
          Reset all data
        </Button>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all data</DialogTitle>
            <DialogDescription>
              This will permanently delete all your funds, contributions, and settings. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll();
                setResetOpen(false);
              }}
            >
              Reset everything
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
