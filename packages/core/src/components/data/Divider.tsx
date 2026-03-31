import type { CSSProperties } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
  style,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={['h-full w-px bg-gray-200 dark:bg-gray-700 self-stretch', className ?? ''].filter(Boolean).join(' ')}
        style={style}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={['flex items-center gap-3 w-full', className ?? ''].filter(Boolean).join(' ')}
        style={style}
      >
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={['border-0 border-t border-gray-200 dark:border-gray-700 w-full', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    />
  );
}
