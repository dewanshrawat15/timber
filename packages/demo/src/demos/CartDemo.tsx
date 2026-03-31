import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const SERVER_URL = 'http://localhost:3001';
const PRODUCT_IDS = Array.from({ length: 12 }, (_, i) => i + 1);

interface CartItem { id: number; qty: number; }

const INITIAL_ITEMS: CartItem[] = [{ id: 1, qty: 1 }, { id: 5, qty: 1 }, { id: 7, qty: 2 }];

export function CartDemo() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [typedPromo, setTypedPromo] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);

  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsParam = useMemo(
    () => items.map(({ id, qty }) => `${id}:${qty}`).join(','),
    [items]
  );

  const fetchSchema = useCallback(async (params: {
    itemsParam: string; appliedPromo: string; giftWrap: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${SERVER_URL}/api/cart`);
      if (params.itemsParam) url.searchParams.set('items', params.itemsParam);
      if (params.appliedPromo) url.searchParams.set('promoCode', params.appliedPromo);
      if (params.giftWrap) url.searchParams.set('giftWrap', 'true');
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
    void fetchSchema({ itemsParam, appliedPromo, giftWrap });
  }, [itemsParam, appliedPromo, giftWrap, fetchSchema]);

  const adjustQty = useCallback((id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const applyPromo = useCallback(() => {
    setAppliedPromo(typedPromo.trim().toUpperCase());
  }, [typedPromo]);

  const overrides = useMemo(() => {
    const o: Record<string, Record<string, unknown>> = {
      'promo-input': {
        value: typedPromo,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTypedPromo(e.target.value),
      },
      'promo-apply-btn': { onClick: applyPromo },
      'remove-promo': {
        onClick: () => { setAppliedPromo(''); setTypedPromo(''); },
      },
      'gift-wrap-toggle': {
        checked: giftWrap,
        onChange: (checked: boolean) => setGiftWrap(checked),
      },
      'checkout-btn': {
        onClick: () => alert('Proceed to checkout! (navigate to Payments tab)'),
      },
      'browse-btn': {
        onClick: () => setItems(INITIAL_ITEMS),
      },
    };

    PRODUCT_IDS.forEach((id) => {
      o[`qty-dec-${id}`] = { onClick: () => adjustQty(id, -1) };
      o[`qty-inc-${id}`] = { onClick: () => adjustQty(id, +1) };
      o[`remove-item-${id}`] = { onClick: () => removeItem(id) };
    });

    return o;
  }, [typedPromo, giftWrap, applyPromo, adjustQty, removeItem]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cart totals, promo validation, shipping threshold, and tax all computed server-side.
          Try promo codes: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">TIMBER10</code>,{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">SAVE20</code>,{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">NEWUSER</code>
        </p>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          GET /api/cart?items={itemsParam || '...'}&promoCode={appliedPromo || '...'}&giftWrap={String(giftWrap)}
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
