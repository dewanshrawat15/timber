import { useState } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';
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

const DEMO_TABS = [
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

type DemoTabId = (typeof DEMO_TABS)[number]['id'];

const STATIC_SCHEMA: TimberSchema = {
  version: '1.0',
  name: 'HeroExample',
  root: {
    type: 'Column',
    styling: { className: 'gap-4' },
    children: [
      {
        type: 'Text',
        props: { as: 'h2' },
        styling: { className: 'text-lg font-semibold text-indigo-600 dark:text-indigo-300' },
        children: 'JSON in, React out',
      },
      {
        type: 'Text',
        props: { as: 'p' },
        styling: { className: 'text-sm text-gray-600 dark:text-gray-400 max-w-xl' },
        children:
          'This block is rendered entirely from a JSON schema — exactly what your server would return.',
      },
      {
        type: 'Row',
        styling: { className: 'gap-3' },
        children: [
          {
            type: 'Button',
            key: 'primary-cta',
            props: { variant: 'primary', size: 'sm' },
            children: 'Primary action',
          },
          {
            type: 'Button',
            key: 'secondary-cta',
            props: { variant: 'secondary', size: 'sm' },
            children: 'Secondary action',
          },
        ],
      },
    ],
  },
};

const isDevEnvironment = import.meta.env.DEV;

export function App() {
  const [activeTab, setActiveTab] = useState<DemoTabId>('server');
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">Timber</span>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                    v0.1.0
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Server-driven React component library powered by JSON schemas.
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                How it works
              </a>
              <a href="#docs" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Docs
              </a>
              <a href="#examples" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Examples
              </a>
              <a
                href="http://localhost:3001/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                API reference
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/dewanshrawat15/timber"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span>Star on GitHub</span>
              </a>

              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {dark ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero + static TimberRenderer example */}
          <section className="border-b border-gray-200 dark:border-gray-900 bg-gradient-to-b from-white/60 via-white/40 to-transparent dark:from-gray-950 dark:via-gray-950">
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-[3fr,2fr] gap-10 items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  Server-driven UI · JSON in, React out
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Build React apps where the{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">server owns the layout</span>.
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl">
                  Timber turns JSON schemas from your backend into a fully themed React interface. Ship new
                  screens by deploying your API, not your frontend.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#docs"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Read the docs
                  </a>
                  <a
                    href="#examples"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Browse examples
                  </a>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    TypeScript · TailwindCSS · HeadlessUI
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Schema-powered UI</p>
                  <span className="text-[10px] rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-gray-500 dark:text-gray-400">
                    Static example (no server)
                  </span>
                </div>
                <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4">
                  <TimberRenderer node={STATIC_SCHEMA.root} />
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="border-b border-gray-200 dark:border-gray-900">
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">How Timber works</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                  At runtime, your backend returns a JSON schema that describes the layout. Timber renders it
                  into real React components and lets you inject client-only behavior via overrides and custom
                  registries.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">01 · Define schema</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your server returns a <code className="font-mono text-xs">TimberSchema</code> describing
                    the layout: components, props, styling, and data.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">02 · Render on client</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    The React app passes <code className="font-mono text-xs">schema.root</code> into{' '}
                    <code className="font-mono text-xs">TimberRenderer</code>, which recursively builds the
                    component tree.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    03 · Wire up behavior
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use the <code className="font-mono text-xs">overrides</code> prop keyed by{' '}
                    <code className="font-mono text-xs">node.key</code> to attach event handlers and local
                    state that cannot be serialized to JSON.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Docs summary */}
          <section id="docs" className="border-b border-gray-200 dark:border-gray-900">
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Install in your app</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Timber ships as <code className="font-mono text-xs">@timber/core</code>, with first-class
                  TypeScript types and TailwindCSS-based styling.
                </p>
                <pre className="text-[11px] leading-relaxed rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <code>{`# Install the core package
npm install @timber/core react react-dom @headlessui/react tailwindcss

# Or with yarn
yarn add @timber/core react react-dom @headlessui/react tailwindcss`}</code>
                </pre>
                <pre className="text-[11px] leading-relaxed rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <code>{`// tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@timber/core/dist/**/*.js',
  ],
  darkMode: 'class',
  safelist: [
    { pattern: /^grid-cols-/ },
    { pattern: /^grid-rows-/ },
  ],
};`}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Render a schema</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is the minimal setup to render a server-provided schema with interactive overrides.
                </p>
                <pre className="text-[11px] leading-relaxed rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <code>{`import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const schema: TimberSchema = {
  version: '1.0',
  root: {
    type: 'Column',
    styling: { className: 'p-6 gap-4' },
    children: [
      {
        type: 'Text',
        props: { as: 'h1' },
        styling: { className: 'text-2xl font-bold' },
        children: 'Hello from the server',
      },
      {
        type: 'Button',
        key: 'cta',
        props: { variant: 'primary' },
        children: 'Get started',
      },
    ],
  },
};

function Screen() {
  return (
    <TimberRenderer
      node={schema.root}
      overrides={{
        cta: { onClick: () => console.log('clicked') },
      }}
    />
  );
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Examples / playground */}
          <section id="examples" className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Examples</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse end-to-end flows powered by Timber&apos;s components and server-driven schemas.
                </p>
              </div>
              <span className="text-[11px] rounded-full bg-gray-100 dark:bg-gray-900 px-3 py-1 text-gray-600 dark:text-gray-400">
                Interactive playground available in development
              </span>
            </div>

            {isDevEnvironment ? (
              <>
                <div className="border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto">
                  <nav className="flex gap-1 min-w-max">
                    {DEMO_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                          'px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
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

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm">
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
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-6 text-sm text-gray-600 dark:text-gray-400 space-y-3">
                <p className="font-medium text-gray-800 dark:text-gray-200">Interactive demos run locally</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Clone the repository and install dependencies with <code className="font-mono text-xs">yarn install</code>.</li>
                  <li>Start the sample API server with <code className="font-mono text-xs">yarn dev:server</code> (port 3001).</li>
                  <li>Run the demo app with <code className="font-mono text-xs">yarn dev:demo</code> and open <code className="font-mono text-xs">http://localhost:5173</code>.</li>
                </ol>
                <p className="text-xs">
                  GitHub Pages hosts only static assets, so the server-driven flows are available when running
                  the sample server locally.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
