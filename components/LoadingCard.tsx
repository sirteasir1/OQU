'use client';

import { useMemo } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { buildLoaderTheme } from '@/lib/loaderTheme';

type Props = {
  title: string;
  subtitle?: string;
  topicKey: string;
  interests?: string[];
};

/**
 * Simple, theme-aware loading screen.
 * Used for onboarding (profile+interests) and profile loading.
 */
export default function LoadingCard({ title, subtitle, topicKey, interests }: Props) {
  const ctx = useGlobalContext();
  const userInterests = interests ?? ctx.userInterests;

  const theme = useMemo(
    () => buildLoaderTheme({ topicKey, interests: userInterests }),
    [topicKey, userInterests]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={theme.bgStyle}>
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 backdrop-blur-xl shadow-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[rgb(var(--border))] rounded-full" />
              <div
                className="absolute inset-0 w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'rgb(var(--fg) / 0.15)', borderTopColor: 'transparent' }}
              />
            </div>

            <div className="min-w-0">
              <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50 truncate">{title}</div>
              {subtitle && (
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</div>
              )}
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Тема интерфейса синхронизирована с Light/Dark mode.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
