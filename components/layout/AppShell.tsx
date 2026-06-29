'use client';

import { Navigation } from './Navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:pt-6 md:pb-4">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Mark-03</h1>
          <p className="text-xs text-gray-500 mt-0.5">Emergency Fund Tracker</p>
        </div>
        <Navigation />
      </aside>

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <div>
            <h1 className="text-base font-bold text-gray-900">Mark-03</h1>
            <p className="text-xs text-gray-500">Emergency Fund Tracker</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-6">{children}</main>
      </div>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
