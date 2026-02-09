import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span>© {year} OQU. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/subscription"
                className="oqu-btn-ghost px-3 py-1.5 text-sm border border-slate-200 dark:border-white/10"
              >
                Подписка
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-50 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-50 transition">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-slate-900 dark:hover:text-slate-50 transition">
                Contact
              </Link>
            </nav>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            Made by <span className="font-semibold text-slate-900 dark:text-slate-50">weshowcode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
