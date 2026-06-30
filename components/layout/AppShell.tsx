'use client';

import { ShieldCheck } from 'lucide-react';
import { Navigation } from './Navigation';

function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';
  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm`}
    >
      <ShieldCheck className={icon} aria-hidden="true" />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="sticky top-0 hidden h-screen md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-slate-200/70 md:bg-white md:pt-6 md:pb-4">
        <div className="mb-8 flex items-center gap-3 px-5">
          <BrandMark />
          <div>
            <h1 className="text-[15px] font-semibold leading-tight tracking-tight text-slate-900">
              Mark-03
            </h1>
            <p className="text-xs leading-tight text-slate-400">Emergency Fund Tracker</p>
          </div>
        </div>
        <Navigation />
        <div className="mt-auto px-5 pt-4">
          <p className="text-[11px] leading-relaxed text-slate-300">
            Track. Project. Stay ready.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden">
          <BrandMark size="sm" />
          <div>
            <h1 className="text-sm font-semibold leading-tight tracking-tight text-slate-900">
              Mark-03
            </h1>
            <p className="text-[11px] leading-tight text-slate-400">Emergency Fund Tracker</p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 pb-24 md:px-8 md:py-9 md:pb-9">
          {children}
        </main>
      </div>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
