import type { CSSProperties } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
  style?: CSSProperties;
}

export function Breadcrumb({
  items,
  separator = '/',
  className,
  style,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={['flex items-center gap-1.5 text-sm text-gray-500', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {isLast || !item.href ? (
              <span
                className={isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </a>
            )}
            {!isLast && (
              <span aria-hidden="true" className="text-gray-300 select-none">
                {separator}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
