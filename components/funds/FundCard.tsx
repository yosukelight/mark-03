'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FundForm } from './FundForm';
import { FUND_TYPE_LABELS, FUND_TYPE_COLORS, type Fund } from '@/lib/types';
import { formatPHP, formatPercent } from '@/lib/calculations';

interface FundCardProps {
  fund: Fund;
  sharePct: number;
  onUpdate: (updates: Partial<Omit<Fund, 'id'>>) => void;
  onDelete: () => void;
}

export function FundCard({ fund, sharePct, onUpdate, onDelete }: FundCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const dotColor = FUND_TYPE_COLORS[fund.type];

  return (
    <>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{fund.name}</p>
                <Badge variant="secondary" className="mt-0.5 text-xs">
                  {FUND_TYPE_LABELS[fund.type]}
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                aria-label={`Edit ${fund.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                aria-label={`Delete ${fund.name}`}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Balance</p>
              <p className="font-semibold text-gray-900">{formatPHP(fund.balance)}</p>
            </div>
            <div>
              <p className="text-gray-500">Share</p>
              <p className="font-semibold text-gray-900">{formatPercent(sharePct)}</p>
            </div>
            <div>
              <p className="text-gray-500">Exp. return</p>
              <p className="font-semibold text-gray-900">
                {formatPercent(fund.expectedReturnPct)}/yr
              </p>
            </div>
          </div>

          {fund.notes && (
            <p className="mt-3 text-xs text-gray-400 truncate" title={fund.notes}>
              {fund.notes}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit fund</DialogTitle>
            <DialogDescription>Update the details for {fund.name}.</DialogDescription>
          </DialogHeader>
          <FundForm
            initialValues={fund}
            submitLabel="Update"
            onSubmit={(values) => {
              onUpdate(values);
              setEditOpen(false);
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete fund</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{fund.name}</strong>? This will also remove
              all associated contributions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
