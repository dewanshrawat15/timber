import type { CSSProperties } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'indigo' | 'white' | 'gray' | 'green' | 'red';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const COLOR_CLASSES: Record<SpinnerColor, string> = {
  indigo: 'border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-400',
  green: 'border-green-200 border-t-green-600 dark:border-green-800 dark:border-t-green-400',
  red: 'border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-400',
};

export function Spinner({
  size = 'md',
  color = 'indigo',
  label = 'Loading…',
  className,
  style,
}: SpinnerProps) {
  return (
    <span
      role="status"
      className={['inline-flex items-center justify-center', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      <span
        aria-hidden="true"
        className={[
          'animate-spin rounded-full',
          SIZE_CLASSES[size],
          COLOR_CLASSES[color],
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
