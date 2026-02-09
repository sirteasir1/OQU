'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, useReducedMotion } from 'framer-motion';

type NavItem = { label: string; icon: string; href: string };

const NAV: NavItem[] = [
  { label: 'Дашборд', icon: '🏠', href: '/dashboard' },
  { label: 'История', icon: '📚', href: '/history' },
  { label: 'Профиль', icon: '👤', href: '/profile' },
  { label: 'Настройки', icon: '⚙️', href: '/settings' },
];

export default function AppShell({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();

  const active = useMemo(() => {
    const direct = NAV.find((n) => pathname === n.href);
    if (direct) return direct.href;
    if (pathname.startsWith('/lesson')) return '/dashboard';
    return NAV[0].href;
  }, [pathname]);

  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-20 lg:w-24 flex-col items-center py-6 gap-4 bg-slate-950 text-slate-100">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black flex items-center justify-center shadow-lg"
            title="OQU"
          >
            O
          </button>

          <div className="mt-2 flex flex-col gap-2">
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition ' +
                    (isActive
                      ? 'bg-white/10 ring-1 ring-white/20'
                      : 'hover:bg-white/10')
                  }
                  title={item.label}
                >
                  <span className="text-xl">{item.icon}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto">
            <ThemeToggle variant="sidebar" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-indigo-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          {/* Top bar */}
          <div className="sticky top-3 z-10">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="backdrop-blur bg-white/70 dark:bg-slate-950/60 border border-black/5 dark:border-white/10 shadow-sm rounded-3xl">
                <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    {title && <div className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-50 truncate">{title}</div>}
                    {subtitle && <div className="text-sm text-slate-600 dark:text-slate-300 truncate">{subtitle}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mobile: theme toggle */}
                    <div className="md:hidden">
                      <ThemeToggle />
                    </div>
                    {right}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          {reduce ? (
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">{children}</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8"
            >
              {children}
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-950/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-4 gap-1">
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={
                  'py-2 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition ' +
                  (isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10')
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* bottom padding for mobile nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}
