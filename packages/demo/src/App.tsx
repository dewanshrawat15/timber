import { useState } from 'react';
import { ServerDrivenDemo } from './demos/ServerDrivenDemo';
import { ComponentsDemo } from './demos/ComponentsDemo';
import { OverlaysDemo } from './demos/OverlaysDemo';
import { CustomRendererDemo } from './demos/CustomRendererDemo';

const TABS = [
  { id: 'server', label: 'Server-Driven UI' },
  { id: 'components', label: 'Components' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'custom', label: 'Custom Renderer' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('server');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Timber</h1>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              v0.1.0
            </span>
          </div>
          <a
            href="http://localhost:3001/docs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            API Docs →
          </a>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
      </main>
    </div>
  );
}
