import type { CSSProperties, ReactNode } from 'react';

export interface NavLink {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface NavbarProps {
  brand?: ReactNode;
  links?: NavLink[];
  actions?: ReactNode;
  sticky?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Navbar({
  brand,
  links,
  actions,
  sticky,
  className,
  style,
}: NavbarProps) {
  return (
    <nav
      className={[
        'w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm',
        sticky ? 'sticky top-0 z-40' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-6">
          {/* Brand */}
          {brand && <div className="shrink-0">{brand}</div>}

          {/* Links */}
          {links && links.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 flex-1">
              {links.map((link, i) => (
                <a
                  key={link.href ?? i}
                  href={link.href ?? '#'}
                  onClick={(e) => { if (link.onClick) { e.preventDefault(); link.onClick(); } }}
                  className={[
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    link.active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800',
                  ].join(' ')}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </nav>
  );
}
