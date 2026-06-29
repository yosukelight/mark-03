'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Settings, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/funds', label: 'Funds', icon: Wallet },
  { href: '/projections', label: 'Projections', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:static md:border-t-0 md:border-r md:h-full">
      <div className="flex md:flex-col">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors md:flex-row md:gap-3 md:rounded-lg md:mx-2 md:px-3 md:py-2.5 md:text-sm',
                active
                  ? 'text-blue-600 md:bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 md:hover:bg-gray-50',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
