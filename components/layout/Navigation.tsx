'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, LayoutDashboard, Wallet, Settings, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/funds', label: 'Funds', icon: Wallet },
  { href: '/contributions', label: 'Contributions', icon: Coins },
  { href: '/projections', label: 'Projections', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/70 bg-white/90 backdrop-blur-md md:static md:border-0 md:bg-transparent md:px-3 md:backdrop-blur-none">
      <div className="flex md:flex-col md:gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors md:flex-row md:gap-3 md:rounded-xl md:px-3 md:py-2.5 md:text-sm',
                active
                  ? 'text-indigo-600 md:bg-indigo-50'
                  : 'text-slate-400 hover:text-slate-700 md:hover:bg-slate-50',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform md:h-[18px] md:w-[18px]',
                  active ? 'scale-105' : 'group-hover:scale-105',
                )}
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
