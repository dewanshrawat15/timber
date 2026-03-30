import type { CSSProperties } from 'react';

export type TabVariant = 'underline' | 'pills';

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: TabVariant;
  className?: string;
  style?: CSSProperties;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
  style,
}: TabsProps) {
  if (variant === 'pills') {
    return (
      <div
        className={['flex gap-1 p-1 bg-gray-100 rounded-lg w-fit', className ?? ''].filter(Boolean).join(' ')}
        role="tablist"
        style={style}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === activeTab}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.key)}
            className={[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              tab.key === activeTab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // underline variant
  return (
    <div
      className={['border-b border-gray-200', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      <nav className="flex gap-0 -mb-px" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === activeTab}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.key)}
            className={[
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              tab.key === activeTab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
