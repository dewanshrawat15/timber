import { Router, type Request, type Response } from 'express';
import { col, row, node, text, btn, schema } from '../lib/schema';

const router = Router();

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '');
  if (/^4/.test(n))       return 'visa';
  if (/^5[1-5]/.test(n))  return 'mastercard';
  if (/^3[47]/.test(n))   return 'amex';
  if (/^6/.test(n))       return 'discover';
  return 'unknown';
}

function formatNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  // Group into chunks of 4
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

function displayNumber(raw: string): string {
  const digits  = raw.replace(/\D/g, '');
  const padded  = digits.padEnd(16, '•');
  return padded.replace(/(.{4})(?=.)/g, '$1 ');
}

function maskCvv(raw: string): string {
  return '•'.repeat(Math.min(raw.length, 4));
}

function formatExpiry(raw: string): string {
  // Accepts 1234 → 12/34
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

const BRAND_LABELS: Record<CardBrand, string> = {
  visa:       'VISA',
  mastercard: 'MASTERCARD',
  amex:       'AMEX',
  discover:   'DISCOVER',
  unknown:    '',
};

// CSS linear-gradient strings — sent as inline style so no Tailwind purge issues
const BRAND_GRADIENTS: Record<CardBrand, string> = {
  visa:       'linear-gradient(135deg, #1a1f71 0%, #0d1240 100%)',
  mastercard: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  amex:       'linear-gradient(135deg, #1e3a2f 0%, #0d2b20 100%)',
  discover:   'linear-gradient(135deg, #7c2d12 0%, #431407 100%)',
  unknown:    'linear-gradient(135deg, #1c1c2e 0%, #0a0a14 100%)',
};

/**
 * @openapi
 * /api/credit-card:
 *   get:
 *     summary: Credit card form schema with brand detection and number formatting
 *     tags:
 *       - Commerce
 *     parameters:
 *       - in: query
 *         name: number
 *         schema: { type: string }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: expiry
 *         schema: { type: string }
 *       - in: query
 *         name: cvv
 *         schema: { type: string }
 *       - in: query
 *         name: flipped
 *         schema: { type: string, enum: ['true','false'] }
 *     responses:
 *       200:
 *         description: TimberSchema for the credit card entry screen
 */
router.get('/', (req: Request, res: Response) => {
  const {
    number = '',
    name   = '',
    expiry = '',
    cvv    = '',
    flipped = 'false',
  } = req.query as Record<string, string>;

  const brand      = detectBrand(number);
  const formatted  = formatNumber(number);
  const displayed  = displayNumber(number);
  const maskedCvv  = maskCvv(cvv);
  const formattedExpiry = formatExpiry(expiry);
  const isFlipped  = flipped === 'true';
  const gradient   = BRAND_GRADIENTS[brand];
  const brandLabel = BRAND_LABELS[brand];

  const root = col({
    props: { gap: 'gap-6' },
    children: [
      text('Credit Card', { props: { as: 'h2' }, styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' } }),

      // Card visual — full width, centred, max-w-sm
      node('CreditCardVisual', {
        key: 'card-visual',
        props: {
          number:    displayed,
          rawNumber: formatted,
          name:      name.toUpperCase() || 'FULL NAME',
          expiry:    formattedExpiry || 'MM/YY',
          cvv:       maskedCvv,
          flipped:   isFlipped,
          brand,
          gradient,
          brandLabel,
        },
        styling: { className: 'w-full max-w-sm mx-auto' },
      }),

      // Form card below
      node('Card', {
        props: { bordered: true, shadow: 'sm' },
        children: [
          col({
            props: { gap: 'gap-4' },
            children: [
              text('Card Details', { props: { as: 'h3' }, styling: { className: 'font-semibold text-gray-900 dark:text-gray-100' } }),

              // Card number with brand badge
              col({
                props: { gap: 'gap-1' },
                children: [
                  row({
                    props: { justify: 'justify-between', align: 'items-center' },
                    styling: { className: 'mb-1' },
                    children: [
                      text('Card Number', { styling: { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' } }),
                      ...(brandLabel ? [node('Badge', { props: { label: brandLabel, variant: 'primary', size: 'sm' } })] : []),
                    ],
                  }),
                  node('Input', {
                    key: 'card-number-input',
                    props: {
                      placeholder: '1234 5678 9012 3456',
                      value: formatted,
                      maxLength: 19,
                      inputMode: 'numeric',
                    },
                  }),
                ],
              }),

              node('Input', {
                key: 'card-name-input',
                props: {
                  label: 'Cardholder Name',
                  placeholder: 'JANE SMITH',
                  value: name.toUpperCase(),
                },
              }),

              row({
                props: { gap: 'gap-3' },
                children: [
                  col({
                    styling: { className: 'flex-1' },
                    children: [
                      node('Input', {
                        key: 'card-expiry-input',
                        props: {
                          label: 'Expiry',
                          placeholder: 'MM/YY',
                          value: formattedExpiry,
                          maxLength: 5,
                          inputMode: 'numeric',
                        },
                      }),
                    ],
                  }),
                  col({
                    styling: { className: 'w-28' },
                    children: [
                      node('Input', {
                        key: 'card-cvv-input',
                        props: {
                          label: 'CVV',
                          placeholder: '•••',
                          value: cvv,
                          maxLength: brand === 'amex' ? 4 : 3,
                          type: 'password',
                          inputMode: 'numeric',
                        },
                      }),
                    ],
                  }),
                ],
              }),

              node('Divider', {}),

              btn('Pay Now', 'pay-btn', 'primary', 'lg', { styling: { className: 'w-full' } }),

              text('🔒  Your payment info is encrypted end-to-end.', {
                styling: { className: 'text-xs text-center text-gray-400 dark:text-gray-500' },
              }),
            ],
          }),
        ],
      }),

      // Quick-fill guide
      node('Alert', {
        props: {
          variant: 'info',
          title: 'Demo mode',
          description: 'Try typing a number starting with 4 (Visa), 51-55 (Mastercard), 34/37 (Amex), or 6 (Discover) to see brand detection.',
        },
      }),
    ],
  });

  res.json(schema('Credit Card', root));
});

export default router;
