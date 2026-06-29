import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Fund, Contribution, Settings } from './types';
import { DEFAULT_SETTINGS } from './types';

interface AppState {
  funds: Fund[];
  contributions: Contribution[];
  settings: Settings;

  // Fund actions
  addFund: (fund: Omit<Fund, 'id' | 'updatedAt'>) => void;
  updateFund: (id: string, updates: Partial<Omit<Fund, 'id'>>) => void;
  deleteFund: (id: string) => void;

  // Contribution actions
  addContribution: (c: Omit<Contribution, 'id'>) => void;
  deleteContribution: (id: string) => void;

  // Settings actions
  updateSettings: (updates: Partial<Settings>) => void;

  // Reset
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      funds: [],
      contributions: [],
      settings: DEFAULT_SETTINGS,

      addFund: (fund) =>
        set((state) => ({
          funds: [
            ...state.funds,
            { ...fund, id: crypto.randomUUID(), updatedAt: new Date().toISOString() },
          ],
        })),

      updateFund: (id, updates) =>
        set((state) => ({
          funds: state.funds.map((f) =>
            f.id === id
              ? { ...f, ...updates, updatedAt: new Date().toISOString() }
              : f,
          ),
        })),

      deleteFund: (id) =>
        set((state) => ({
          funds: state.funds.filter((f) => f.id !== id),
          contributions: state.contributions.filter((c) => c.fundId !== id),
        })),

      addContribution: (c) =>
        set((state) => ({
          contributions: [{ ...c, id: crypto.randomUUID() }, ...state.contributions],
        })),

      deleteContribution: (id) =>
        set((state) => ({
          contributions: state.contributions.filter((c) => c.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

      resetAll: () =>
        set({ funds: [], contributions: [], settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'mark03-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
