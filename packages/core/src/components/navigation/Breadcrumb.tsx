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
      className={['flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {isLast || !item.href ? (
              <span
                className={isLast ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {item.label}
              </a>
            )}
            {!isLast && (
              <span aria-hidden="true" className="text-gray-300 dark:text-gray-600 select-none">
                {separator}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
