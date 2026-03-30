import { useState, useEffect, useCallback } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const SERVER_URL = 'http://localhost:3001';

const SCREENS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'card-list', label: 'Card List' },
  { id: 'modal', label: 'Modal' },
  { id: 'bottom-sheet', label: 'Bottom Sheet' },
] as const;

type ScreenId = (typeof SCREENS)[number]['id'];

export function ServerDrivenDemo() {
  const [screen, setScreen] = useState<ScreenId>('dashboard');
  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Overlay state — injected via overrides since JSON can't hold functions
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchSchema = useCallback(async (screenId: ScreenId) => {
    setLoading(true);
    setError(null);
    setModalOpen(false);
    setSheetOpen(false);
    try {
      const res = await fetch(`${SERVER_URL}/api/details?screen=${screenId}`);
      if (!res.ok) {
        const body = await res.json() as { error: string };
        throw new Error(body.error);
      }
      setSchema(await res.json() as TimberSchema);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch schema');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSchema(screen);
  }, [screen, fetchSchema]);

  return (
    <div className="space-y-6">
      {/* Explainer */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Server-Driven UI</h2>
        <p className="text-sm text-gray-500">
          The layout below is fetched from the sample Express server as a{' '}
          <code className="bg-gray-100 px-1 rounded text-xs">TimberSchema</code> JSON object and
          rendered entirely by{' '}
          <code className="bg-gray-100 px-1 rounded text-xs">TimberRenderer</code>. Select a screen
          to fetch a different layout.
        </p>
        <div className="mt-3 text-xs text-gray-400 font-mono">
          GET {SERVER_URL}/api/details?screen={screen}
        </div>
      </div>

      {/* Screen picker */}
      <div className="flex flex-wrap gap-2">
        {SCREENS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              screen === s.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Render area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Loading schema...
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-red-500 text-sm font-medium">{error}</p>
            <p className="text-gray-400 text-xs">
              Make sure the sample server is running:{' '}
              <code className="bg-gray-100 px-1 rounded">yarn dev:server</code>
            </p>
          </div>
        )}

        {!loading && !error && schema && (
          <TimberRenderer
            node={schema.root}
            overrides={{
              // Modal screen
              'open-modal-btn': { onClick: () => setModalOpen(true) },
              'confirm-modal': {
                isOpen: modalOpen,
                onClose: () => setModalOpen(false),
              },
              'modal-cancel-btn': { onClick: () => setModalOpen(false) },
              'modal-confirm-btn': { onClick: () => setModalOpen(false) },
              // Bottom sheet screen
              'open-sheet-btn': { onClick: () => setSheetOpen(true) },
              'options-sheet': {
                isOpen: sheetOpen,
                onClose: () => setSheetOpen(false),
              },
              'sheet-close-btn': { onClick: () => setSheetOpen(false) },
              'sheet-option-1': { onClick: () => setSheetOpen(false) },
              'sheet-option-2': { onClick: () => setSheetOpen(false) },
              'sheet-option-3': { onClick: () => setSheetOpen(false) },
            }}
          />
        )}
      </div>

      {/* Raw schema */}
      {schema && (
        <details className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <summary className="px-5 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 select-none">
            Raw JSON schema
          </summary>
          <pre className="p-5 text-xs text-gray-600 overflow-auto max-h-96 bg-gray-50 border-t border-gray-200">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
