'use client';

import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'oqu_theme';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export default function ThemeToggle({ variant = 'default' }: { variant?: 'default' | 'sidebar' }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load saved theme or fall back to system preference
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null);
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      applyTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const label = useMemo(() => (theme === 'dark' ? 'Темная' : 'Светлая'), [theme]);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const base =
    'inline-flex items-center justify-center w-11 h-11 rounded-full border transition shadow-sm select-none';
  const classes =
    variant === 'sidebar'
      ? `${base} border-white/20 bg-white/10 hover:bg-white/20 text-white`
      : `${base} border-[rgb(var(--border))] bg-white/60 dark:bg-slate-950/40 hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100`;

  return (
    <button
      type="button"
      onClick={toggle}
      className={classes}
      aria-label={`Тема: ${label}`}
      title={`Тема: ${label}`}
    >
      <span className="text-lg" aria-hidden>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
