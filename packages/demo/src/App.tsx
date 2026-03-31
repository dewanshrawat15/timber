import { useState } from 'react';
import { ServerDrivenDemo } from './demos/ServerDrivenDemo';
import { ComponentsDemo } from './demos/ComponentsDemo';
import { OverlaysDemo } from './demos/OverlaysDemo';
import { CustomRendererDemo } from './demos/CustomRendererDemo';
import { FormsDemo } from './demos/FormsDemo';
import { FeedbackDemo } from './demos/FeedbackDemo';
import { NavigationDemo } from './demos/NavigationDemo';
import { DataDemo } from './demos/DataDemo';
import { MarketplaceDemo } from './demos/MarketplaceDemo';
import { SearchDemo } from './demos/SearchDemo';
import { CartDemo } from './demos/CartDemo';
import { ProductDetailDemo } from './demos/ProductDetailDemo';
import { PaymentsDemo } from './demos/PaymentsDemo';
import { CreditCardDemo } from './demos/CreditCardDemo';

const TABS = [
  { id: 'server', label: 'Server-Driven UI' },
  { id: 'components', label: 'Components' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'custom', label: 'Custom Renderer' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'data', label: 'Data' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'search', label: 'Search' },
  { id: 'cart', label: 'Cart' },
  { id: 'product', label: 'Product Detail' },
  { id: 'payments', label: 'Payments' },
  { id: 'creditcard', label: 'Credit Card' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('server');
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Timber</h1>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                v0.1.0
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="http://localhost:3001/docs"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                API Docs →
              </a>
              {/* Dark mode toggle */}
              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {dark ? (
                  /* Sun icon */
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
            <nav className="flex gap-1 min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {activeTab === 'server' && <ServerDrivenDemo />}
          {activeTab === 'components' && <ComponentsDemo />}
          {activeTab === 'overlays' && <OverlaysDemo />}
          {activeTab === 'custom' && <CustomRendererDemo />}
          {activeTab === 'forms' && <FormsDemo />}
          {activeTab === 'feedback' && <FeedbackDemo />}
          {activeTab === 'navigation' && <NavigationDemo />}
          {activeTab === 'data' && <DataDemo />}
          {activeTab === 'marketplace' && <MarketplaceDemo />}
          {activeTab === 'search' && <SearchDemo />}
          {activeTab === 'cart' && <CartDemo />}
          {activeTab === 'product' && <ProductDetailDemo />}
          {activeTab === 'payments' && <PaymentsDemo />}
          {activeTab === 'creditcard' && <CreditCardDemo />}
        </main>
      </div>
    </div>
  );
}
