'use client';

import { GlobalProvider } from '@/context/GlobalProvider';
import PageTransition from '@/components/PageTransition';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <PageTransition>{children}</PageTransition>
    </GlobalProvider>
  );
}
