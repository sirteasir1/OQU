'use client';

export default function Skeleton({
  className,
  rounded = 'rounded-xl',
}: {
  className?: string;
  rounded?: string;
}) {
  return <div className={`oqu-skeleton ${rounded} ${className ?? ''}`.trim()} />;
}
