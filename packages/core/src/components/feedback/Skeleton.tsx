import type { CSSProperties } from 'react';

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  lines?: number;
  className?: string;
  style?: CSSProperties;
}

const ROUNDED_CLASSES: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function SkeletonLine({ widthClass, rounded }: { widthClass: string; rounded: string }) {
  return (
    <div
      className={[
        'animate-pulse bg-gray-200 dark:bg-gray-700 h-4',
        rounded,
        widthClass,
      ].join(' ')}
    />
  );
}

export function Skeleton({
  width,
  height,
  rounded = 'md',
  lines,
  className,
  style,
}: SkeletonProps) {
  const roundedClass = ROUNDED_CLASSES[rounded];

  if (lines && lines > 1) {
    return (
      <div
        className={['flex flex-col gap-2', className ?? ''].filter(Boolean).join(' ')}
        style={style}
      >
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonLine
            key={i}
            rounded={roundedClass}
            widthClass={i === lines - 1 ? 'w-3/4' : 'w-full'}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        roundedClass,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
        ...style,
      }}
    />
  );
}
