import type { CSSProperties, ReactNode } from 'react';

export interface RowProps {
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Row({
  gap,
  align,
  justify,
  wrap,
  children,
  className,
  style,
}: RowProps) {
  const classes = [
    'flex flex-row',
    gap ?? '',
    align ?? '',
    justify ?? '',
    wrap ? 'flex-wrap' : '',
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
