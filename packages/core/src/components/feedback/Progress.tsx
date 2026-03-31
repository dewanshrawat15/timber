import type { CSSProperties } from 'react';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressColor = 'indigo' | 'green' | 'yellow' | 'red' | 'gray';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: ProgressSize;
  color?: ProgressColor;
  showLabel?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZE_CLASSES: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const COLOR_CLASSES: Record<ProgressColor, string> = {
  indigo: 'bg-indigo-600 dark:bg-indigo-500',
  green: 'bg-green-500 dark:bg-green-400',
  yellow: 'bg-yellow-400 dark:bg-yellow-500',
  red: 'bg-red-500 dark:bg-red-400',
  gray: 'bg-gray-400 dark:bg-gray-500',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'indigo',
  showLabel,
  label,
  className,
  style,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={['w-full', className ?? ''].filter(Boolean).join(' ')} style={style}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showLabel && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={['w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', SIZE_CLASSES[size]].join(' ')}
      >
        <div
          className={['h-full rounded-full transition-all duration-500', COLOR_CLASSES[color]].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
