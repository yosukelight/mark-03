import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mark-03 — Emergency Fund Tracker',
  description: 'Track your emergency funds, investments, and purchasing power over time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 text-slate-900 antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
