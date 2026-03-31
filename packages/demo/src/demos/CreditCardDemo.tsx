import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';
import { CreditCardVisual } from '../components/CreditCardVisual';

// Mirror server-side formatting so the input displays the formatted value
function formatNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

const SERVER_URL = 'http://localhost:3001';

export function CreditCardDemo() {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);

  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSchema = useCallback(async (params: {
    number: string; name: string; expiry: string; cvv: string; flipped: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${SERVER_URL}/api/credit-card`);
      if (params.number) url.searchParams.set('number', params.number);
      if (params.name)   url.searchParams.set('name', params.name);
      if (params.expiry) url.searchParams.set('expiry', params.expiry);
      if (params.cvv)    url.searchParams.set('cvv', params.cvv);
      if (params.flipped) url.searchParams.set('flipped', 'true');
      const res = await fetch(url.toString());
      setSchema(await res.json() as TimberSchema);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetch: fires 300ms after the last state change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSchema({ number, name, expiry, cvv, flipped });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [number, name, expiry, cvv, flipped, fetchSchema]);

  const overrides = useMemo(() => ({
    'card-number-input': {
      value: formatNumber(number),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
        setNumber(digits);
      },
    },
    'card-name-input': {
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    },
    'card-expiry-input': {
      value: formatExpiry(expiry),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
        setExpiry(digits);
      },
    },
    'card-cvv-input': {
      value: cvv,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCvv(e.target.value),
      onFocus: () => setFlipped(true),
      onBlur: () => setFlipped(false),
    },
    'pay-btn': {
      onClick: () => alert('Payment submitted! (demo)'),
    },
    // The CreditCardVisual node — flip state injected as prop override
    'card-visual': {
      flipped,
    },
  }), [number, name, expiry, cvv, flipped]);

  // Custom registry: register CreditCardVisual so TimberRenderer can render it
  const registry = useMemo(() => ({ CreditCardVisual }), []);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Live card brand detection, number formatting, and expiry formatting computed server-side.
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded mx-1 text-xs">CreditCardVisual</code>
          is a custom client-side component registered via the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">registry</code> prop.
          Focus the CVV field to flip the card.
        </p>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          GET /api/credit-card?number={number.slice(0, 4) || '...'}&flipped={String(flipped)}
        </div>
      </div>

      {loading && !schema && (
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">Loading...</div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-xs text-gray-400">Make sure the server is running: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">yarn dev:server</code></p>
        </div>
      )}
      {!error && schema && (
        <TimberRenderer node={schema.root} overrides={overrides} registry={registry} />
      )}
    </div>
  );
}
