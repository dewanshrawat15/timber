import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const SERVER_URL = 'http://localhost:3001';
const CATEGORIES = ['Audio', 'Laptops', 'Tablets', 'Accessories', 'Monitors'];
const QUICK_PRICES = ['100', '300', '500', '1000'];
const MIN_RATINGS = ['3', '3.5', '4', '4.5'];
const PRODUCT_IDS = Array.from({ length: 12 }, (_, i) => i + 1);

export function SearchDemo() {
  const [q, setQ] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState('');
  const [minRating, setMinRating] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevant');
  const [cartIds, setCartIds] = useState<number[]>([]);

  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = useCallback(async (params: {
    q: string; categories: string[]; priceMax: string;
    minRating: string; inStockOnly: boolean; sortBy: string; cartIds: number[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${SERVER_URL}/api/search`);
      if (params.q) url.searchParams.set('q', params.q);
      if (params.categories.length) url.searchParams.set('categories', params.categories.join(','));
      if (params.priceMax) url.searchParams.set('priceMax', params.priceMax);
      if (params.minRating) url.searchParams.set('minRating', params.minRating);
      if (params.inStockOnly) url.searchParams.set('inStockOnly', 'true');
      if (params.sortBy !== 'relevant') url.searchParams.set('sortBy', params.sortBy);
      if (params.cartIds.length) url.searchParams.set('cartIds', params.cartIds.join(','));
      const res = await fetch(url.toString());
      setSchema(await res.json() as TimberSchema);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSchema({ q, categories, priceMax, minRating, inStockOnly, sortBy, cartIds });
  }, [q, categories, priceMax, minRating, inStockOnly, sortBy, cartIds, fetchSchema]);

  const toggleCategory = useCallback((cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const clearAll = useCallback(() => {
    setQ('');
    setCategories([]);
    setPriceMax('');
    setMinRating('');
    setInStockOnly(false);
  }, []);

  const overrides = useMemo(() => {
    const o: Record<string, Record<string, unknown>> = {
      'search-input': {
        value: q,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
      },
      'search-btn': { onClick: () => void fetchSchema({ q, categories, priceMax, minRating, inStockOnly, sortBy, cartIds }) },
      'price-max-input': {
        value: priceMax,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(e.target.value),
      },
      'in-stock-filter': { checked: inStockOnly, onChange: (checked: boolean) => setInStockOnly(checked) },
      'sort-select': { value: sortBy, onChange: (v: string) => setSortBy(v) },
      'clear-all-filters': { onClick: clearAll },
      'remove-price-max': { onClick: () => setPriceMax('') },
      'remove-min-rating': { onClick: () => setMinRating('') },
      'remove-in-stock': { onClick: () => setInStockOnly(false) },
    };

    CATEGORIES.forEach((cat) => {
      o[`cat-${cat}`] = {
        checked: categories.includes(cat),
        onChange: () => toggleCategory(cat),
      };
      o[`remove-cat-${cat}`] = { onClick: () => toggleCategory(cat) };
    });

    QUICK_PRICES.forEach((p) => {
      o[`quick-price-${p}`] = {
        onClick: () => setPriceMax(priceMax === p ? '' : p),
      };
    });

    MIN_RATINGS.forEach((r) => {
      o[`min-rating-${r}`] = {
        onClick: () => setMinRating(minRating === r ? '' : r),
      };
    });

    PRODUCT_IDS.forEach((id) => {
      o[`add-to-cart-${id}`] = {
        onClick: () => setCartIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        ),
      };
    });

    return o;
  }, [q, categories, priceMax, minRating, inStockOnly, sortBy, cartIds, clearAll, toggleCategory, fetchSchema]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Server-driven search: filters, sort, and brand detection all computed server-side.
          Cart IDs are tracked client-side and sent to the server to toggle button variants.
        </p>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          GET /api/search?q={q || '...'}&categories={categories.join(',') || '...'}&sortBy={sortBy}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
          Loading...
        </div>
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
