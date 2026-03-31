import { useState, useEffect, useCallback, useMemo } from 'react';
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const SERVER_URL = 'http://localhost:3001';

export function PaymentsDemo() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('card');
  const [promoCode] = useState('');

  // Local form state — not re-fetched on keystroke, just kept controlled
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const [schema, setSchema] = useState<TimberSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback((key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  const fetchSchema = useCallback(async (s: number, m: string, promo: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${SERVER_URL}/api/checkout`);
      url.searchParams.set('step', String(s));
      url.searchParams.set('method', m);
      if (promo) url.searchParams.set('promoCode', promo);
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
    void fetchSchema(step, method, promoCode);
  }, [step, method, promoCode, fetchSchema]);

  const overrides = useMemo(() => {
    const o: Record<string, Record<string, unknown>> = {
      'next-step-btn': {
        onClick: () => setStep((s) => Math.min(4, s + 1)),
      },
      'prev-step-btn': {
        onClick: () => setStep((s) => Math.max(1, s - 1)),
      },
      'continue-shopping-btn': {
        onClick: () => { setStep(1); setMethod('card'); setFormValues({}); },
      },
      'payment-method-select': {
        value: method,
        onChange: (v: string) => setMethod(v),
      },
      'save-card-toggle': {
        onChange: () => {/* no-op for demo */},
      },
      // Shipping form fields — controlled locally, no re-fetch on keystroke
      'first-name':  { value: formValues['first-name']  ?? '', onChange: setField('first-name') },
      'last-name':   { value: formValues['last-name']   ?? '', onChange: setField('last-name') },
      'address-1':   { value: formValues['address-1']   ?? '', onChange: setField('address-1') },
      'address-2':   { value: formValues['address-2']   ?? '', onChange: setField('address-2') },
      'city':        { value: formValues['city']        ?? '', onChange: setField('city') },
      'state':       { value: formValues['state']       ?? '', onChange: setField('state') },
      'zip':         { value: formValues['zip']         ?? '', onChange: setField('zip') },
      'country':     { value: formValues['country']     ?? 'us', onChange: (_v: string) => setFormValues((prev) => ({ ...prev, country: _v })) },
      // Payment card fields
      'card-number': { value: formValues['card-number'] ?? '', onChange: setField('card-number') },
      'card-name':   { value: formValues['card-name']   ?? '', onChange: setField('card-name') },
      'card-expiry': { value: formValues['card-expiry'] ?? '', onChange: setField('card-expiry') },
      'card-cvv':    { value: formValues['card-cvv']    ?? '', onChange: setField('card-cvv') },
    };
    return o;
  }, [method, formValues, setField]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Multi-step checkout with server-computed step indicator, order summary, and conditional payment forms.
          The server renders a different layout for each step.
        </p>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
          GET /api/checkout?step={step}&method={method}
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
