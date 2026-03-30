import type { CSSProperties, ReactNode } from 'react';

export interface TextProps {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Text({ as: Tag = 'p', children, className, style }: TextProps) {
  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}
