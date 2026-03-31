import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema, TimberNode } from '@timber/core';

const SERVER_URL = 'http://localhost:3001';

function collectKeys(node: TimberNode, prefix: string): string[] {
  const keys: string[] = [];
  if (node.key?.startsWith(prefix)) keys.push(node.key);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      keys.push(...collectKeys(child as TimberNode, prefix));
    }
  }
  return keys;
}

export function ProductDetailDemo() {
  const [productId, setProductId] = useState(2);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset variant selections when product changes
  const handleProductChange = useCallback((id: number) => {
    setProductId(id);
    setSelectedColor('');
    setSelectedSize('');
    setQty(1);
    setTab('description');
    setAddedToCart(false);
  }, []);

  const fetchSchema = useCallback(async (params: {
    productId: number; color: string; size: string; qty: number;
    tab: string; addedToCart: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${SERVER_URL}/api/product`);
      url.searchParams.set('id', String(params.productId));
      if (params.color) url.searchParams.set('color', params.color);
      if (params.size) url.searchParams.set('size', params.size);
      url.searchParams.set('qty', String(params.qty));
      url.searchParams.set('tab', params.tab);
      if (params.addedToCart) url.searchParams.set('addedToCart', 'true');
      const res = await fetch(url.toString());
      if (!res.ok) {
        const body = await res.json() as { error: string };
        throw new Error(body.error);
      }
      setSchema(await res.json() as TimberSchema);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSchema({ productId, color: selectedColor, size: selectedSize, qty, tab, addedToCart });
  }, [productId, selectedColor, selectedSize, qty, tab, addedToCart, fetchSchema]);

  // Derive dynamic color/size keys from the fetched schema
  const colorKeys = useMemo(() => schema ? collectKeys(schema.root, 'color-') : [], [schema]);
  const sizeKeys = useMemo(() => schema ? collectKeys(schema.root, 'size-') : [], [schema]);

  const overrides = useMemo(() => {
    const o: Record<string, Record<string, unknown>> = {
      'qty-dec': { onClick: () => setQty((q) => Math.max(1, q - 1)), disabled: qty <= 1 },
      'qty-inc': { onClick: () => setQty((q) => Math.min(10, q + 1)), disabled: qty >= 10 },
      'add-to-cart-btn': {
        onClick: () => setAddedToCart(true),
      },
      'buy-now-btn': {
        onClick: () => alert('Buy now! (navigate to Payments tab)'),
      },
      'detail-tabs': {
        onChange: (key: string) => setTab(key),
      },
    };

    colorKeys.forEach((key) => {
      const color = key.replace('color-', '');
      o[key] = { onClick: () => setSelectedColor(color) };
    });

    sizeKeys.forEach((key) => {
      const size = key.replace('size-', '');
      o[key] = { onClick: () => setSelectedSize(size) };
    });

    return o;
  }, [qty, colorKeys, sizeKeys]);

  const PRODUCTS = [
    { id: 1, name: 'AirPods Pro' },
    { id: 2, name: 'MacBook Air M3' },
    { id: 3, name: 'Sony WH-1000XM5' },
    { id: 4, name: 'iPad Air 11"' },
    { id: 5, name: 'MX Master 3S' },
    { id: 6, name: 'Samsung 4K Monitor' },
    { id: 7, name: 'Keychron Q2' },
    { id: 8, name: 'Anker 200W Charger' },
    { id: 9, name: 'LG UltraWide 34"' },
    { id: 10, name: 'Dell XPS 15' },
    { id: 11, name: 'Jabra Evolve2 75' },
    { id: 12, name: 'Apple Pencil Pro' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Full product detail page: color/size selection, qty controls, tabs (description/specs/reviews) — all server-driven.
        </p>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProductChange(p.id)}
              className={[
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                productId === p.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400',
              ].join(' ')}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          GET /api/product?id={productId}&tab={tab}&qty={qty}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">Loading...</div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-xs text-gray-400">Make sure the server is running: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">yarn dev:server</code></p>
        </div>
      )}
      {!loading && !error && schema && (
        <TimberRenderer node={schema.root} overrides={overrides} />
      )}
    </div>
  );
}
