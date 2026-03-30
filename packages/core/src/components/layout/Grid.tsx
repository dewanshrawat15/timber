import type { CSSProperties, ReactNode } from 'react';

export interface GridProps {
  cols?: number;
  rows?: number;
  gap?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const ROWS_MAP: Record<number, string> = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5',
  6: 'grid-rows-6',
};

export function Grid({
  cols,
  rows,
  gap,
  children,
  className,
  style,
}: GridProps) {
  const classes = [
    'grid',
    cols ? (COLS_MAP[cols] ?? `grid-cols-${cols}`) : '',
    rows ? (ROWS_MAP[rows] ?? `grid-rows-${rows}`) : '',
    gap ?? '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
