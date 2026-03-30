import type { CSSProperties, ReactNode } from 'react';

export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  bordered?: boolean;
  shadow?: CardShadow;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const SHADOW_CLASSES: Record<CardShadow, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export function Card({
  title,
  subtitle,
  footer,
  bordered = false,
  shadow = 'sm',
  children,
  className,
  style,
}: CardProps) {
  const classes = [
    'rounded-xl bg-white p-4',
    bordered ? 'border border-gray-200' : '',
    SHADOW_CLASSES[shadow],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
      {footer && (
        <div className="mt-4 border-t border-gray-100 pt-3">{footer}</div>
      )}
    </div>
  );
}
