import type { CSSProperties, ReactNode } from 'react';

export interface ColumnProps {
  gap?: string;
  align?: string;
  justify?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Column({
  gap,
  align,
  justify,
  children,
  className,
  style,
}: ColumnProps) {
  const classes = [
    'flex flex-col',
    gap ?? '',
    align ?? '',
    justify ?? '',
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
