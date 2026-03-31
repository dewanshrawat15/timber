import { Router, type Request, type Response } from 'express';
import { PRODUCTS } from '../data/products';
import { validatePromo } from '../data/promos';
import { col, row, node, text, btn, schema, type TimberNode } from '../lib/schema';

const router = Router();

const STEPS = [
  { key: 'review',   label: 'Review'   },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment',  label: 'Payment'  },
  { key: 'confirm',  label: 'Confirm'  },
];

const PAYMENT_METHODS = [
  { label: 'Credit / Debit Card', value: 'card'     },
  { label: 'PayPal',              value: 'paypal'   },
  { label: 'Apple Pay',           value: 'applepay' },
];

// Hardcoded demo order items
const DEMO_ITEMS = [
  { id: 1, qty: 1 },
  { id: 5, qty: 1 },
  { id: 7, qty: 2 },
];

function stepIndicator(currentStep: number): TimberNode {
  return row({
    props: { gap: 'gap-0', align: 'items-center' },
    styling: { className: 'mb-2' },
    children: STEPS.flatMap((step, i) => {
      const stepNum   = i + 1;
      const isDone    = stepNum < currentStep;
      const isActive  = stepNum === currentStep;
      const circleClass = isDone
        ? 'w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shrink-0'
        : isActive
          ? 'w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 ring-4 ring-indigo-100 dark:ring-indigo-900/40'
          : 'w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center text-sm font-bold shrink-0';
      const labelClass = isActive
        ? 'text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1'
        : isDone
          ? 'text-xs font-medium text-green-600 dark:text-green-400 mt-1'
          : 'text-xs text-gray-400 dark:text-gray-500 mt-1';

      const stepNode: TimberNode = col({
        props: { align: 'items-center', gap: 'gap-1' },
        styling: { className: 'flex-1' },
        children: [
          col({
            styling: { className: circleClass },
            children: isDone ? '✓' : String(stepNum),
          }),
          text(step.label, { styling: { className: labelClass } }),
        ],
      });

      const nodes: TimberNode[] = [stepNode];
      if (i < STEPS.length - 1) {
        nodes.push(col({
          styling: {
            className: `h-0.5 flex-1 mt-4 mx-1 ${isDone ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`,
          },
        }));
      }
      return nodes;
    }),
  });
}

function orderSummary(promoCode: string): TimberNode {
  const items = DEMO_ITEMS.flatMap(({ id, qty }) => {
    const p = PRODUCTS.find((prod) => prod.id === id);
    if (!p) return [];
    return [{ product: p, qty }];
  });
  const promo      = promoCode ? validatePromo(promoCode) : null;
  const subtotal   = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const discount   = promo ? subtotal * (promo.discountPct / 100) : 0;
  const shipping   = subtotal - discount >= 200 ? 0 : 12.99;
  const tax        = (subtotal - discount) * 0.08;
  const total      = subtotal - discount + shipping + tax;

  return node('Card', {
    props: { bordered: true, shadow: 'sm' },
    styling: { className: 'lg:w-80 shrink-0' },
    children: [
      col({
        props: { gap: 'gap-3' },
        children: [
          text('Order Summary', { props: { as: 'h3' }, styling: { className: 'font-semibold text-gray-900 dark:text-gray-100' } }),
          node('Divider', {}),
          ...items.map(({ product, qty }) =>
            row({
              key: `summary-item-${product.id}`,
              props: { justify: 'justify-between', align: 'items-center' },
              children: [
                text(`${product.image} ${product.name}${qty > 1 ? ` ×${qty}` : ''}`, {
                  styling: { className: 'text-sm text-gray-600 dark:text-gray-400 truncate' },
                }),
                text(`$${(product.price * qty).toFixed(2)}`, {
                  styling: { className: 'text-sm font-medium text-gray-900 dark:text-gray-100 shrink-0 ml-2' },
                }),
              ],
            }),
          ),
          node('Divider', {}),
          row({ props: { justify: 'justify-between' }, children: [
            text('Subtotal', { styling: { className: 'text-sm text-gray-500 dark:text-gray-400' } }),
            text(`$${subtotal.toFixed(2)}`, { styling: { className: 'text-sm font-medium text-gray-900 dark:text-gray-100' } }),
          ]}),
          ...(promo ? [row({ props: { justify: 'justify-between' }, children: [
            text(`Promo (${promo.code})`, { styling: { className: 'text-sm text-green-600 dark:text-green-400' } }),
            text(`−$${discount.toFixed(2)}`, { styling: { className: 'text-sm font-medium text-green-600 dark:text-green-400' } }),
          ]})] : []),
          row({ props: { justify: 'justify-between' }, children: [
            text('Shipping', { styling: { className: 'text-sm text-gray-500 dark:text-gray-400' } }),
            shipping === 0
              ? node('Badge', { props: { label: 'FREE', variant: 'success', size: 'sm' } })
              : text(`$${shipping.toFixed(2)}`, { styling: { className: 'text-sm font-medium text-gray-900 dark:text-gray-100' } }),
          ]}),
          row({ props: { justify: 'justify-between' }, children: [
            text('Tax (8%)', { styling: { className: 'text-sm text-gray-500 dark:text-gray-400' } }),
            text(`$${tax.toFixed(2)}`, { styling: { className: 'text-sm font-medium text-gray-900 dark:text-gray-100' } }),
          ]}),
          node('Divider', {}),
          row({ props: { justify: 'justify-between' }, children: [
            text('Total', { styling: { className: 'font-bold text-gray-900 dark:text-gray-100' } }),
            text(`$${total.toFixed(2)}`, { styling: { className: 'text-xl font-bold text-gray-900 dark:text-gray-100' } }),
          ]}),
          col({
            props: { gap: 'gap-1.5', align: 'items-center' },
            styling: { className: 'pt-1' },
            children: [
              text('🔒  SSL secured checkout', { styling: { className: 'text-xs text-gray-400 dark:text-gray-500' } }),
              row({ props: { gap: 'gap-2', align: 'items-center' }, children: [
                text('VISA', { styling: { className: 'text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded px-1' } }),
                text('MC', { styling: { className: 'text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded px-1' } }),
                text('AMEX', { styling: { className: 'text-xs font-bold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded px-1' } }),
                text('PayPal', { styling: { className: 'text-xs font-bold text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded px-1' } }),
              ]}),
            ],
          }),
        ],
      }),
    ],
  });
}

function stepContent(step: number, paymentMethod: string): TimberNode {
  if (step === 1) {
    // Review step
    return col({
      props: { gap: 'gap-4' },
      children: [
        text('Review Your Order', { props: { as: 'h2' }, styling: { className: 'text-xl font-semibold text-gray-900 dark:text-gray-100' } }),
        ...DEMO_ITEMS.flatMap(({ id, qty }) => {
          const p = PRODUCTS.find((prod) => prod.id === id);
          if (!p) return [];
          return [node('Card', {
            key: `review-item-${id}`,
            props: { bordered: true, shadow: 'none' },
            children: [row({ props: { gap: 'gap-3', align: 'items-center' }, children: [
              col({ styling: { className: 'w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl shrink-0' }, children: p.image }),
              col({ styling: { className: 'flex-1' }, children: [
                text(p.name, { styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                text(`Qty: ${qty} · $${(p.price * qty).toFixed(2)}`, { styling: { className: 'text-xs text-gray-500 dark:text-gray-400' } }),
              ]}),
            ]}),
          ]},
          )];
        }),
        btn('Continue to Shipping →', 'next-step-btn'),
      ],
    });
  }

  if (step === 2) {
    // Shipping step
    return col({
      props: { gap: 'gap-4' },
      children: [
        text('Shipping Address', { props: { as: 'h2' }, styling: { className: 'text-xl font-semibold text-gray-900 dark:text-gray-100' } }),
        node('Card', {
          props: { bordered: true, shadow: 'sm' },
          children: [col({ props: { gap: 'gap-3' }, children: [
            row({ props: { gap: 'gap-3' }, children: [
              node('Input', { key: 'first-name', props: { label: 'First Name', placeholder: 'Jane' }, styling: { className: 'flex-1' } }),
              node('Input', { key: 'last-name',  props: { label: 'Last Name',  placeholder: 'Smith' }, styling: { className: 'flex-1' } }),
            ]}),
            node('Input', { key: 'address-1', props: { label: 'Address', placeholder: '123 Main St' } }),
            node('Input', { key: 'address-2', props: { placeholder: 'Apt, suite, floor (optional)' } }),
            row({ props: { gap: 'gap-3' }, children: [
              node('Input', { key: 'city',  props: { label: 'City',  placeholder: 'San Francisco' }, styling: { className: 'flex-1' } }),
              node('Input', { key: 'state', props: { label: 'State', placeholder: 'CA' }, styling: { className: 'w-20' } }),
              node('Input', { key: 'zip',   props: { label: 'ZIP',   placeholder: '94105' }, styling: { className: 'w-28' } }),
            ]}),
            node('Select', { key: 'country', props: { label: 'Country', value: 'us', options: [
              { label: 'United States', value: 'us' },
              { label: 'Canada',        value: 'ca' },
              { label: 'United Kingdom', value: 'gb' },
            ]}}),
          ]}),
        ],
        }),
        row({ props: { gap: 'gap-3' }, children: [
          btn('← Back', 'prev-step-btn', 'secondary'),
          btn('Continue to Payment →', 'next-step-btn'),
        ]}),
      ],
    });
  }

  if (step === 3) {
    // Payment step
    const cardForm: TimberNode = col({
      props: { gap: 'gap-3' },
      children: [
        node('Input', { key: 'card-number',  props: { label: 'Card Number',    placeholder: '1234 5678 9012 3456', maxLength: 19 } }),
        node('Input', { key: 'card-name',    props: { label: 'Name on Card',   placeholder: 'JANE SMITH' } }),
        row({ props: { gap: 'gap-3' }, children: [
          node('Input', { key: 'card-expiry', props: { label: 'Expiry', placeholder: 'MM/YY', maxLength: 5 }, styling: { className: 'flex-1' } }),
          node('Input', { key: 'card-cvv',    props: { label: 'CVV', placeholder: '•••', maxLength: 4, type: 'password' }, styling: { className: 'w-28' } }),
        ]}),
        node('Toggle', { key: 'save-card-toggle', props: { label: 'Save card for future purchases', checked: false } }),
      ],
    });

    const paypalForm: TimberNode = col({
      props: { gap: 'gap-3', align: 'items-center' },
      styling: { className: 'py-8' },
      children: [
        text('🅿️', { styling: { className: 'text-4xl' } }),
        text('You will be redirected to PayPal to complete your payment.', {
          styling: { className: 'text-sm text-gray-500 dark:text-gray-400 text-center' },
        }),
      ],
    });

    const applePayForm: TimberNode = col({
      props: { gap: 'gap-3', align: 'items-center' },
      styling: { className: 'py-8' },
      children: [
        text('', { styling: { className: 'text-4xl' } }),
        text('Use Face ID or Touch ID to complete your purchase.', {
          styling: { className: 'text-sm text-gray-500 dark:text-gray-400 text-center' },
        }),
      ],
    });

    const methodForm = paymentMethod === 'paypal' ? paypalForm : paymentMethod === 'applepay' ? applePayForm : cardForm;

    return col({
      props: { gap: 'gap-4' },
      children: [
        text('Payment', { props: { as: 'h2' }, styling: { className: 'text-xl font-semibold text-gray-900 dark:text-gray-100' } }),
        node('Card', {
          props: { bordered: true, shadow: 'sm' },
          children: [col({ props: { gap: 'gap-4' }, children: [
            node('Select', {
              key: 'payment-method-select',
              props: { label: 'Payment Method', value: paymentMethod, options: PAYMENT_METHODS },
            }),
            methodForm,
          ]})],
        }),
        row({ props: { gap: 'gap-3' }, children: [
          btn('← Back', 'prev-step-btn', 'secondary'),
          btn('Place Order →', 'next-step-btn'),
        ]}),
      ],
    });
  }

  // Step 4: Confirmation
  return col({
    props: { gap: 'gap-4', align: 'items-center' },
    styling: { className: 'py-12 text-center' },
    children: [
      text('🎉', { styling: { className: 'text-7xl' } }),
      text('Order Confirmed!', { props: { as: 'h2' }, styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' } }),
      text('Thank you for your purchase. A confirmation email has been sent.', {
        styling: { className: 'text-gray-500 dark:text-gray-400 max-w-sm' },
      }),
      node('Alert', { props: { variant: 'success', title: 'Estimated delivery: 3–5 business days', description: 'Order #TBR-29311 is being prepared for shipment.' } }),
      btn('Continue Shopping', 'continue-shopping-btn', 'secondary'),
    ],
  });
}

/**
 * @openapi
 * /api/checkout:
 *   get:
 *     summary: Returns checkout flow schema for the current step
 *     tags:
 *       - Commerce
 *     parameters:
 *       - in: query
 *         name: step
 *         schema: { type: integer, minimum: 1, maximum: 4 }
 *       - in: query
 *         name: method
 *         schema: { type: string, enum: [card, paypal, applepay] }
 *       - in: query
 *         name: promoCode
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: TimberSchema for the checkout page
 */
router.get('/', (req: Request, res: Response) => {
  const { step: stepParam = '1', method = 'card', promoCode = '' } = req.query as Record<string, string>;
  const step = Math.max(1, Math.min(4, Number(stepParam) || 1));

  const root = col({
    props: { gap: 'gap-6' },
    children: [
      stepIndicator(step),
      row({
        props: { gap: 'gap-8', align: 'items-start' },
        children: [
          col({ styling: { className: 'flex-1 min-w-0' }, children: [stepContent(step, method)] }),
          ...(step < 4 ? [orderSummary(promoCode)] : []),
        ],
      }),
    ],
  });

  res.json(schema('Checkout', root));
});

export default router;
