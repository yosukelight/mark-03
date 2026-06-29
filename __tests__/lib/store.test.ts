import { act } from '@testing-library/react';
import { useStore } from '@/lib/store';
import { DEFAULT_SETTINGS } from '@/lib/types';

beforeEach(() => {
  // Reset store to initial state before each test
  act(() => {
    useStore.getState().resetAll();
  });
  localStorage.clear();
});

describe('useStore — funds', () => {
  it('starts with empty funds', () => {
    expect(useStore.getState().funds).toHaveLength(0);
  });

  it('addFund adds a fund with generated id and updatedAt', () => {
    act(() => {
      useStore.getState().addFund({
        name: 'BDO Savings',
        type: 'cash',
        balance: 100_000,
        expectedReturnPct: 0,
      });
    });
    const { funds } = useStore.getState();
    expect(funds).toHaveLength(1);
    expect(funds[0].id).toBeTruthy();
    expect(funds[0].updatedAt).toBeTruthy();
    expect(funds[0].name).toBe('BDO Savings');
  });

  it('addFund generates unique ids', () => {
    act(() => {
      useStore.getState().addFund({ name: 'A', type: 'cash', balance: 0, expectedReturnPct: 0 });
      useStore.getState().addFund({ name: 'B', type: 'cash', balance: 0, expectedReturnPct: 0 });
    });
    const { funds } = useStore.getState();
    expect(funds[0].id).not.toBe(funds[1].id);
  });

  it('updateFund updates specified fields', () => {
    act(() => {
      useStore.getState().addFund({ name: 'Fund A', type: 'cash', balance: 10_000, expectedReturnPct: 0 });
    });
    const id = useStore.getState().funds[0].id;
    act(() => {
      useStore.getState().updateFund(id, { balance: 20_000, name: 'Fund A Updated' });
    });
    const updated = useStore.getState().funds[0];
    expect(updated.balance).toBe(20_000);
    expect(updated.name).toBe('Fund A Updated');
    expect(updated.type).toBe('cash');
  });

  it('updateFund sets updatedAt to a new timestamp', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    act(() => {
      useStore.getState().addFund({ name: 'Fund A', type: 'cash', balance: 0, expectedReturnPct: 0 });
    });
    const originalUpdatedAt = useStore.getState().funds[0].updatedAt;
    const id = useStore.getState().funds[0].id;
    jest.setSystemTime(new Date('2026-01-01T00:01:00.000Z'));
    act(() => {
      useStore.getState().updateFund(id, { balance: 999 });
    });
    expect(useStore.getState().funds[0].updatedAt).not.toBe(originalUpdatedAt);
    jest.useRealTimers();
  });

  it('updateFund does not affect other funds', () => {
    act(() => {
      useStore.getState().addFund({ name: 'A', type: 'cash', balance: 1, expectedReturnPct: 0 });
      useStore.getState().addFund({ name: 'B', type: 'mp2', balance: 2, expectedReturnPct: 7 });
    });
    const idA = useStore.getState().funds[0].id;
    act(() => {
      useStore.getState().updateFund(idA, { balance: 999 });
    });
    expect(useStore.getState().funds[1].balance).toBe(2);
  });

  it('deleteFund removes the fund', () => {
    act(() => {
      useStore.getState().addFund({ name: 'Fund A', type: 'cash', balance: 0, expectedReturnPct: 0 });
    });
    const id = useStore.getState().funds[0].id;
    act(() => {
      useStore.getState().deleteFund(id);
    });
    expect(useStore.getState().funds).toHaveLength(0);
  });

  it('deleteFund also removes associated contributions', () => {
    act(() => {
      useStore.getState().addFund({ name: 'Fund A', type: 'cash', balance: 0, expectedReturnPct: 0 });
    });
    const fundId = useStore.getState().funds[0].id;
    act(() => {
      useStore.getState().addContribution({ fundId, amount: 5_000, date: '2026-01-01' });
    });
    expect(useStore.getState().contributions).toHaveLength(1);
    act(() => {
      useStore.getState().deleteFund(fundId);
    });
    expect(useStore.getState().contributions).toHaveLength(0);
  });

  it('deleteFund ignores non-existent id', () => {
    act(() => {
      useStore.getState().addFund({ name: 'A', type: 'cash', balance: 0, expectedReturnPct: 0 });
    });
    act(() => {
      useStore.getState().deleteFund('non-existent-id');
    });
    expect(useStore.getState().funds).toHaveLength(1);
  });
});

describe('useStore — contributions', () => {
  it('starts with empty contributions', () => {
    expect(useStore.getState().contributions).toHaveLength(0);
  });

  it('addContribution adds with generated id, newest first', () => {
    act(() => {
      useStore.getState().addContribution({ fundId: 'f1', amount: 5_000, date: '2026-01-01' });
      useStore.getState().addContribution({ fundId: 'f1', amount: 10_000, date: '2026-02-01' });
    });
    const { contributions } = useStore.getState();
    expect(contributions).toHaveLength(2);
    expect(contributions[0].amount).toBe(10_000); // newest first
    expect(contributions[0].id).toBeTruthy();
  });

  it('deleteContribution removes a contribution', () => {
    act(() => {
      useStore.getState().addContribution({ fundId: 'f1', amount: 1_000, date: '2026-01-01' });
    });
    const id = useStore.getState().contributions[0].id;
    act(() => {
      useStore.getState().deleteContribution(id);
    });
    expect(useStore.getState().contributions).toHaveLength(0);
  });

  it('deleteContribution does not affect other contributions', () => {
    act(() => {
      useStore.getState().addContribution({ fundId: 'f1', amount: 1_000, date: '2026-01-01' });
      useStore.getState().addContribution({ fundId: 'f1', amount: 2_000, date: '2026-02-01' });
    });
    const idToDelete = useStore.getState().contributions[1].id; // older one
    act(() => {
      useStore.getState().deleteContribution(idToDelete);
    });
    const remaining = useStore.getState().contributions;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].amount).toBe(2_000);
  });
});

describe('useStore — settings', () => {
  it('starts with DEFAULT_SETTINGS', () => {
    expect(useStore.getState().settings).toEqual(DEFAULT_SETTINGS);
  });

  it('updateSettings merges partial updates', () => {
    act(() => {
      useStore.getState().updateSettings({ monthlyExpenses: 30_000 });
    });
    const { settings } = useStore.getState();
    expect(settings.monthlyExpenses).toBe(30_000);
    expect(settings.targetMonths).toBe(DEFAULT_SETTINGS.targetMonths);
    expect(settings.inflationRatePct).toBe(DEFAULT_SETTINGS.inflationRatePct);
  });

  it('updateSettings can update multiple fields at once', () => {
    act(() => {
      useStore.getState().updateSettings({ monthlyExpenses: 25_000, medicalBuffer: 50_000 });
    });
    const { settings } = useStore.getState();
    expect(settings.monthlyExpenses).toBe(25_000);
    expect(settings.medicalBuffer).toBe(50_000);
  });
});

describe('useStore — resetAll', () => {
  it('clears all funds, contributions, and resets settings', () => {
    act(() => {
      useStore.getState().addFund({ name: 'A', type: 'cash', balance: 0, expectedReturnPct: 0 });
      useStore.getState().addContribution({ fundId: 'f1', amount: 100, date: '2026-01-01' });
      useStore.getState().updateSettings({ monthlyExpenses: 50_000 });
    });

    act(() => {
      useStore.getState().resetAll();
    });

    const state = useStore.getState();
    expect(state.funds).toHaveLength(0);
    expect(state.contributions).toHaveLength(0);
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
  });
});
