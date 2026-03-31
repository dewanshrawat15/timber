import { Router, type Request, type Response } from 'express';
import { getProductById } from '../data/products';
import { col, row, node, text, btn, schema, type TimberNode } from '../lib/schema';

const router = Router();

const TAB_KEYS = ['description', 'specs', 'reviews'] as const;
type TabKey = typeof TAB_KEYS[number];

/**
 * @openapi
 * /api/product:
 *   get:
 *     summary: Get product detail schema
 *     tags:
 *       - Commerce
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: color
 *         schema: { type: string }
 *       - in: query
 *         name: size
 *         schema: { type: string }
 *       - in: query
 *         name: qty
 *         schema: { type: integer }
 *       - in: query
 *         name: tab
 *         schema: { type: string, enum: [description, specs, reviews] }
 *       - in: query
 *         name: addedToCart
 *         schema: { type: string, enum: ['true','false'] }
 *     responses:
 *       200:
 *         description: TimberSchema for the product detail page
 *       404:
 *         description: Product not found
 */
router.get('/', (req: Request, res: Response) => {
  const {
    id,
    color: colorParam,
    size: sizeParam,
    qty: qtyParam = '1',
    tab = 'description',
    addedToCart = 'false',
  } = req.query as Record<string, string>;

  const product = getProductById(Number(id));
  if (!product) {
    return res.status(404).json({ error: `Product ${id} not found.` });
  }

  const selectedColor = colorParam && product.colors.includes(colorParam) ? colorParam : product.colors[0] ?? '';
  const selectedSize  = sizeParam  && product.sizes.includes(sizeParam)   ? sizeParam  : product.sizes[0]  ?? '';
  const qty           = Math.max(1, Math.min(10, Number(qtyParam) || 1));
  const activeTab     = (TAB_KEYS as readonly string[]).includes(tab) ? (tab as TabKey) : 'description';
  const inCart        = addedToCart === 'true';

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // --- Tab content ---
  let tabContent: TimberNode;
  if (activeTab === 'description') {
    tabContent = col({
      props: { gap: 'gap-3' },
      children: [
        text(product.description, { styling: { className: 'text-sm text-gray-600 dark:text-gray-400 leading-relaxed' } }),
        row({
          props: { gap: 'gap-3', wrap: true },
          children: [
            node('Badge', { props: { label: 'Free Shipping', variant: 'success', dot: true } }),
            node('Badge', { props: { label: '30-Day Returns', variant: 'primary', dot: true } }),
            node('Badge', { props: { label: '2-Year Warranty', variant: 'default', dot: true } }),
          ],
        }),
      ],
    });
  } else if (activeTab === 'specs') {
    tabContent = node('Table', {
      props: {
        columns: [
          { key: 'spec', header: 'Specification' },
          { key: 'value', header: 'Value' },
        ],
        rows: Object.entries(product.specs).map(([spec, value]) => ({ spec, value })),
        striped: true,
        bordered: true,
      },
    });
  } else {
    // Reviews tab
    tabContent = col({
      props: { gap: 'gap-4' },
      children: product.reviewList.map((review) =>
        node('Card', {
          key: `review-${review.id}`,
          props: { bordered: true, shadow: 'none' },
          children: [
            col({
              props: { gap: 'gap-2' },
              children: [
                row({
                  props: { gap: 'gap-3', align: 'items-center' },
                  children: [
                    node('Avatar', { props: { name: review.author, size: 'sm' } }),
                    col({
                      children: [
                        text(review.author, { styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                        row({
                          props: { gap: 'gap-2', align: 'items-center' },
                          children: [
                            text(`${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`, { styling: { className: 'text-amber-400 text-xs' } }),
                            text(review.date, { styling: { className: 'text-xs text-gray-400 dark:text-gray-500' } }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                text(review.body, { styling: { className: 'text-sm text-gray-600 dark:text-gray-400' } }),
              ],
            }),
          ],
        }),
      ),
    });
  }

  // --- Color selector ---
  const colorSelector: TimberNode = col({
    props: { gap: 'gap-2' },
    children: [
      text('Color', { styling: { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' } }),
      row({
        props: { gap: 'gap-2', wrap: true },
        children: product.colors.map((c) =>
          btn(c, `color-${c}`, c === selectedColor ? 'primary' : 'secondary', 'sm'),
        ),
      }),
    ],
  });

  // --- Size selector ---
  const sizeSelector: TimberNode = col({
    props: { gap: 'gap-2' },
    children: [
      text('Size', { styling: { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' } }),
      row({
        props: { gap: 'gap-2', wrap: true },
        children: product.sizes.map((s) =>
          btn(s, `size-${s}`, s === selectedSize ? 'primary' : 'secondary', 'sm'),
        ),
      }),
    ],
  });

  const root = col({
    props: { gap: 'gap-6' },
    children: [
      // Breadcrumb
      node('Breadcrumb', {
        props: {
          items: [
            { label: 'Products', href: '#' },
            { label: product.category, href: '#' },
            { label: product.name },
          ],
        },
      }),

      // Main content row
      row({
        props: { gap: 'gap-8', align: 'items-start' },
        children: [
          // Left: image gallery placeholder
          node('Card', {
            props: { bordered: true, shadow: 'sm' },
            styling: { className: 'w-96 shrink-0' },
            children: [
              col({
                props: { gap: 'gap-3', align: 'items-center' },
                children: [
                  col({
                    styling: { className: 'w-full h-64 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-8xl' },
                    children: product.image,
                  }),
                  row({
                    props: { gap: 'gap-2' },
                    children: [1, 2, 3].map((i) =>
                      col({
                        key: `thumb-${i}`,
                        styling: { className: 'w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl cursor-pointer border-2 border-transparent hover:border-indigo-400' },
                        children: product.image,
                      }),
                    ),
                  }),
                ],
              }),
            ],
          }),

          // Right: product info
          col({
            styling: { className: 'flex-1 min-w-0' },
            props: { gap: 'gap-4' },
            children: [
              // Brand + name
              col({
                props: { gap: 'gap-1' },
                children: [
                  text(product.brand, { styling: { className: 'text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide' } }),
                  text(product.name, { props: { as: 'h1' }, styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' } }),
                ],
              }),

              // Rating
              row({
                props: { gap: 'gap-2', align: 'items-center' },
                children: [
                  text(`${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}`, { styling: { className: 'text-amber-400' } }),
                  text(`${product.rating}`, { styling: { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' } }),
                  text(`(${product.reviews.toLocaleString()} reviews)`, { styling: { className: 'text-sm text-gray-400 dark:text-gray-500' } }),
                ],
              }),

              // Price
              row({
                props: { gap: 'gap-3', align: 'items-baseline' },
                children: [
                  text(`$${product.price}`, { styling: { className: 'text-3xl font-bold text-gray-900 dark:text-gray-100' } }),
                  ...(product.originalPrice ? [
                    text(`$${product.originalPrice}`, { styling: { className: 'text-lg text-gray-400 dark:text-gray-500 line-through' } }),
                    node('Badge', { props: { label: `${discount}% off`, variant: 'error' } }),
                  ] : []),
                ],
              }),

              node('Divider', {}),

              // Color + size selectors
              colorSelector,
              sizeSelector,

              // Qty selector
              col({
                props: { gap: 'gap-2' },
                children: [
                  text('Quantity', { styling: { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' } }),
                  row({
                    props: { gap: 'gap-2', align: 'items-center' },
                    children: [
                      btn('−', 'qty-dec', 'secondary', 'md', { props: { variant: 'secondary', size: 'md', disabled: qty <= 1 } }),
                      text(String(qty), { styling: { className: 'w-12 text-center font-semibold text-gray-900 dark:text-gray-100' } }),
                      btn('+', 'qty-inc', 'secondary', 'md', { props: { variant: 'secondary', size: 'md', disabled: qty >= 10 } }),
                    ],
                  }),
                ],
              }),

              node('Divider', {}),

              // CTAs
              row({
                props: { gap: 'gap-3' },
                children: [
                  btn(
                    inCart ? '✓ In Cart' : 'Add to Cart',
                    'add-to-cart-btn',
                    inCart ? 'secondary' : 'primary',
                    'lg',
                    {
                      styling: { className: 'flex-1' },
                      props: { variant: inCart ? 'secondary' : 'primary', size: 'lg', disabled: !product.inStock },
                    },
                  ),
                  btn('Buy Now', 'buy-now-btn', 'secondary', 'lg', {
                    props: { variant: 'secondary', size: 'lg', disabled: !product.inStock },
                  }),
                ],
              }),

              // Stock status
              node('Badge', {
                props: {
                  label: product.inStock ? 'In Stock' : 'Out of Stock',
                  variant: product.inStock ? 'success' : 'error',
                  dot: true,
                },
              }),
            ],
          }),
        ],
      }),

      // Tabs: description / specs / reviews
      col({
        props: { gap: 'gap-4' },
        children: [
          node('Tabs', {
            key: 'detail-tabs',
            props: {
              tabs: [
                { key: 'description', label: 'Description' },
                { key: 'specs',       label: 'Specifications' },
                { key: 'reviews',     label: `Reviews (${product.reviewList.length})` },
              ],
              activeTab,
              variant: 'underline',
            },
          }),
          tabContent,
        ],
      }),
    ],
  });

  return res.json(schema(`${product.name}`, root));
});

export default router;
