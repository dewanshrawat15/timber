import type { CSSProperties } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  style?: CSSProperties;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-indigo-100 text-indigo-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-700',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  primary: 'bg-indigo-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot,
  className,
  style,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={['h-1.5 w-1.5 rounded-full', DOT_CLASSES[variant]].join(' ')}
        />
      )}
      {label}
    </span>
  );
}
