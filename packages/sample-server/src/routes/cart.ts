import { Router, type Request, type Response } from 'express';
import { PRODUCTS } from '../data/products';
import { validatePromo } from '../data/promos';
import { col, row, node, text, btn, schema, type TimberNode } from '../lib/schema';

const router = Router();

interface CartItemInput {
  id: number;
  qty: number;
}

function parseItems(raw: string): CartItemInput[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((chunk) => {
      const [id, qty] = chunk.split(':').map(Number);
      return { id, qty };
    })
    .filter((i) => !isNaN(i.id) && !isNaN(i.qty) && i.qty > 0);
}

function lineItem(name: string, amount: number, key?: string, negative = false): TimberNode {
  return row({
    key,
    props: { justify: 'justify-between', align: 'items-center' },
    children: [
      text(name, { styling: { className: 'text-sm text-gray-600 dark:text-gray-400' } }),
      text(`${negative ? '−' : ''}$${Math.abs(amount).toFixed(2)}`, {
        styling: {
          className: negative
            ? 'text-sm font-medium text-green-600 dark:text-green-400'
            : 'text-sm font-medium text-gray-900 dark:text-gray-100',
        },
      }),
    ],
  });
}

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Compute cart totals and return a cart schema
 *     tags:
 *       - Commerce
 *     parameters:
 *       - in: query
 *         name: items
 *         schema: { type: string }
 *         description: "Comma-separated id:qty pairs, e.g. 1:2,5:1"
 *       - in: query
 *         name: promoCode
 *         schema: { type: string }
 *       - in: query
 *         name: giftWrap
 *         schema: { type: string, enum: ['true','false'] }
 *     responses:
 *       200:
 *         description: TimberSchema for the cart page
 */
router.get('/', (req: Request, res: Response) => {
  const { items: rawItems = '', promoCode = '', giftWrap = 'false' } = req.query as Record<string, string>;

  const parsed    = parseItems(rawItems);
  const giftWrapOn = giftWrap === 'true';
  const promo     = promoCode ? validatePromo(promoCode) : null;
  const promoApplied = promo !== null && promoCode.trim() !== '';

  // Resolve product details for each cart item
  const cartItems = parsed.flatMap((ci) => {
    const product = PRODUCTS.find((p) => p.id === ci.id);
    if (!product) return [];
    return [{ product, qty: ci.qty }];
  });

  // Business logic: totals
  const subtotal      = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const shippingThreshold = 200;
  const shipping      = subtotal >= shippingThreshold ? 0 : 12.99;
  const giftWrapFee   = giftWrapOn ? 5.99 : 0;
  const promoDiscount = promoApplied ? (subtotal * (promo!.discountPct / 100)) : 0;
  const taxable       = subtotal - promoDiscount;
  const tax           = taxable * 0.08;
  const total         = taxable + shipping + giftWrapFee + tax;
  const totalItems    = cartItems.reduce((s, { qty }) => s + qty, 0);

  // --- Empty cart state ---
  if (cartItems.length === 0) {
    const root = col({
      styling: { className: 'max-w-lg mx-auto py-20 text-center' },
      props: { gap: 'gap-4', align: 'items-center' },
      children: [
        text('🛒', { styling: { className: 'text-7xl' } }),
        text('Your cart is empty', { props: { as: 'h2' }, styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' } }),
        text('Add some products to get started.', { styling: { className: 'text-gray-500 dark:text-gray-400' } }),
        btn('Browse products', 'browse-btn'),
      ],
    });
    return res.json(schema('Cart', root));
  }

  // --- Cart item cards ---
  const itemCards: TimberNode[] = cartItems.map(({ product, qty }) =>
    node('Card', {
      key: `cart-item-${product.id}`,
      props: { bordered: true, shadow: 'sm' },
      children: [
        row({
          props: { gap: 'gap-4', align: 'items-start' },
          children: [
            // Thumbnail
            col({
              styling: { className: 'w-20 h-20 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-3xl' },
              children: product.image,
            }),
            // Details
            col({
              props: { gap: 'gap-1' },
              styling: { className: 'flex-1 min-w-0' },
              children: [
                text(product.name, { props: { as: 'h4' }, styling: { className: 'font-semibold text-gray-900 dark:text-gray-100 leading-snug' } }),
                text(product.colors[0] ?? '', { styling: { className: 'text-xs text-gray-500 dark:text-gray-400' } }),
                text(`$${(product.price * qty).toFixed(2)}`, { styling: { className: 'text-sm font-bold text-gray-900 dark:text-gray-100 mt-1' } }),
                ...(qty > 1 ? [text(`($${product.price} each)`, { styling: { className: 'text-xs text-gray-400 dark:text-gray-500' } })] : []),
              ],
            }),
            // Qty controls + remove
            col({
              props: { gap: 'gap-2', align: 'items-end' },
              children: [
                row({
                  props: { gap: 'gap-1', align: 'items-center' },
                  children: [
                    btn('−', `qty-dec-${product.id}`, 'secondary', 'sm', { styling: { className: 'w-7 h-7 p-0' } }),
                    text(String(qty), { styling: { className: 'w-8 text-center text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                    btn('+', `qty-inc-${product.id}`, 'secondary', 'sm', { styling: { className: 'w-7 h-7 p-0' } }),
                  ],
                }),
                btn('Remove', `remove-item-${product.id}`, 'ghost', 'sm', {
                  styling: { className: 'text-red-500 hover:text-red-700 dark:text-red-400' },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  );

  // --- Summary line items ---
  const summaryLines: TimberNode[] = [
    lineItem('Subtotal', subtotal),
    ...(promoApplied ? [lineItem(`Promo (${promoCode.toUpperCase()}) −${promo!.discountPct}%`, promoDiscount, 'promo-line', true)] : []),
    shipping === 0
      ? row({
          props: { justify: 'justify-between', align: 'items-center' },
          children: [
            text('Shipping', { styling: { className: 'text-sm text-gray-600 dark:text-gray-400' } }),
            node('Badge', { props: { label: 'FREE', variant: 'success', size: 'sm' } }),
          ],
        })
      : lineItem('Shipping', shipping),
    ...(giftWrapOn ? [lineItem('Gift wrapping', giftWrapFee)] : []),
    lineItem('Estimated tax (8%)', tax),
  ];

  // --- Promo section ---
  const promoSection: TimberNode = promoApplied
    ? row({
        props: { gap: 'gap-2', align: 'items-center' },
        children: [
          node('Alert', {
            props: {
              variant: 'success',
              title: `${promo!.code} applied — ${promo!.description}`,
            },
            styling: { className: 'flex-1' },
          }),
          btn('Remove', 'remove-promo', 'ghost', 'sm'),
        ],
      })
    : col({
        props: { gap: 'gap-1' },
        children: [
          row({
            props: { gap: 'gap-2' },
            children: [
              node('Input', {
                key: 'promo-input',
                props: { placeholder: 'Promo code (try TIMBER10)', value: promoCode },
                styling: { className: 'flex-1' },
              }),
              btn('Apply', 'promo-apply-btn', 'secondary'),
            ],
          }),
        ],
      });

  const root = col({
    props: { gap: 'gap-6' },
    children: [
      text(`Shopping Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`, {
        props: { as: 'h2' },
        styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' },
      }),

      row({
        props: { gap: 'gap-6', align: 'items-start' },
        children: [
          // Cart items column
          col({
            styling: { className: 'flex-1' },
            props: { gap: 'gap-3' },
            children: [
              ...itemCards,
              // Free shipping nudge
              ...(subtotal < shippingThreshold
                ? [
                    node('Alert', {
                      props: {
                        variant: 'info',
                        description: `Add $${(shippingThreshold - subtotal).toFixed(2)} more for free shipping!`,
                      },
                    }),
                  ]
                : []),
            ],
          }),

          // Order summary
          col({
            styling: { className: 'lg:w-80 shrink-0' },
            props: { gap: 'gap-3' },
            children: [
              node('Card', {
                props: { bordered: true, shadow: 'sm' },
                children: [
                  col({
                    props: { gap: 'gap-3' },
                    children: [
                      text('Order Summary', { props: { as: 'h3' }, styling: { className: 'font-semibold text-gray-900 dark:text-gray-100' } }),
                      node('Divider', {}),
                      ...summaryLines,
                      node('Divider', {}),
                      row({
                        props: { justify: 'justify-between' },
                        children: [
                          text('Total', { styling: { className: 'text-base font-bold text-gray-900 dark:text-gray-100' } }),
                          text(`$${total.toFixed(2)}`, { styling: { className: 'text-xl font-bold text-gray-900 dark:text-gray-100' } }),
                        ],
                      }),
                      promoSection,
                      // Gift wrap toggle
                      node('Toggle', {
                        key: 'gift-wrap-toggle',
                        props: { label: 'Add gift wrapping (+$5.99)', checked: giftWrapOn },
                      }),
                      btn('Proceed to Checkout →', 'checkout-btn', 'primary', 'md', { styling: { className: 'w-full mt-2' } }),
                    ],
                  }),
                ],
              }),

              // Trust badges
              node('Card', {
                props: { bordered: true, shadow: 'none' },
                children: [
                  col({
                    props: { gap: 'gap-2' },
                    children: [
                      { type: 'Row', props: { gap: 'gap-2', align: 'items-center' }, children: [text('🔄'), text('30-day free returns', { styling: { className: 'text-xs text-gray-500 dark:text-gray-400' } })] },
                      { type: 'Row', props: { gap: 'gap-2', align: 'items-center' }, children: [text('🚚'), text(`Free shipping over $${shippingThreshold}`, { styling: { className: 'text-xs text-gray-500 dark:text-gray-400' } })] },
                      { type: 'Row', props: { gap: 'gap-2', align: 'items-center' }, children: [text('🛡️'), text('2-year warranty included', { styling: { className: 'text-xs text-gray-500 dark:text-gray-400' } })] },
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  res.json(schema('Cart', root));
});

export default router;
