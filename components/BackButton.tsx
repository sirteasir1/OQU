'use client';

import { useRouter } from 'next/navigation';

type Props = {
  className?: string;
  label?: string;
  fallbackHref?: string;
};

export default function BackButton({
  className,
  label = 'Back',
  fallbackHref = '/',
}: Props) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button type="button" onClick={goBack} className={`oqu-btn-ghost gap-2 ${className ?? ''}`.trim()}>
      <span aria-hidden>←</span>
      <span>{label}</span>
    </button>
  );
}
