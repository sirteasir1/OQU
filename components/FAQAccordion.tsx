'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export type FAQItem = {
  q: string;
  a: string;
};

export default function FAQAccordion({
  title = 'FAQ',
  subtitle,
  items,
}: {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}) {
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const safeItems = useMemo(() => items.filter((i) => i?.q && i?.a), [items]);

  return (
    <div className="oqu-card p-5 md:p-6">
      <div>
        <div className="text-xs font-black tracking-wider text-slate-500">HELP</div>
        <h3 className="mt-2 text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-50">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
      </div>

      <div className="mt-4 space-y-2">
        {safeItems.map((it, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx((p) => (p === idx ? null : idx))}
                className="w-full text-left px-4 md:px-5 py-4 flex items-center justify-between gap-3"
              >
                <div className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-50">{it.q}</div>
                <div
                  className={
                    'shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition ' +
                    (isOpen
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-white/10')
                  }
                  aria-hidden
                >
                  {isOpen ? '−' : '+'}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="px-4 md:px-5 pb-4"
                  >
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{it.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
