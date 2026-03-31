import { Router, type Request, type Response } from 'express';
import { PRODUCTS, type Product } from '../data/products';
import { col, row, node, text, btn, schema, type TimberNode } from '../lib/schema';

const router = Router();

const CATEGORIES = ['Audio', 'Laptops', 'Tablets', 'Accessories', 'Monitors'];
const SORT_OPTIONS = [
  { label: 'Most Relevant',     value: 'relevant'   },
  { label: 'Price: Low → High', value: 'price-asc'  },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Best Rated',        value: 'rating'      },
  { label: 'Most Reviews',      value: 'reviews'     },
];

function applyFilters(
  q: string,
  categories: string[],
  priceMax: number | null,
  minRating: number | null,
  inStockOnly: boolean,
  sortBy: string,
): Product[] {
  let list = PRODUCTS.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    if (categories.length > 0 && !categories.includes(p.category)) return false;
    if (priceMax !== null && p.price > priceMax) return false;
    if (minRating !== null && p.rating < minRating) return false;
    if (inStockOnly && !p.inStock) return false;
    return true;
  });

  if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'reviews')    list = [...list].sort((a, b) => b.reviews - a.reviews);
  return list;
}

function productCard(p: Product, inCart: boolean): TimberNode {
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;

  return node('Card', {
    key: `product-card-${p.id}`,
    props: { bordered: true, shadow: 'sm' },
    children: [
      // Thumbnail
      col({
        styling: { className: 'bg-gray-50 dark:bg-gray-800 rounded-lg h-28 flex items-center justify-center text-5xl mb-3 relative' },
        children: p.image,
      }),
      // Category
      text(p.category, { styling: { className: 'text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide' } }),
      // Name
      node('Text', { props: { as: 'h4' }, styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1 leading-snug' }, children: p.name }),
      // Stars
      text(
        `${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))} ${p.rating} (${p.reviews.toLocaleString()})`,
        { styling: { className: 'text-xs text-amber-400 mt-1' } },
      ),
      // Price row
      row({
        props: { gap: 'gap-2', align: 'items-baseline' },
        styling: { className: 'mt-2' },
        children: [
          text(`$${p.price}`, { styling: { className: 'text-lg font-bold text-gray-900 dark:text-gray-100' } }),
          ...(p.originalPrice
            ? [text(`$${p.originalPrice}`, { styling: { className: 'text-sm text-gray-400 dark:text-gray-500 line-through' } })]
            : []),
          ...(discount > 0
            ? [node('Badge', { props: { label: `${discount}% off`, variant: 'success', size: 'sm' } })]
            : []),
        ],
      }),
      // Out-of-stock label or Add-to-cart button
      p.inStock
        ? btn(
            inCart ? '✓ Added' : 'Add to Cart',
            `add-to-cart-${p.id}`,
            inCart ? 'secondary' : 'primary',
            'sm',
            { styling: { className: 'w-full mt-2' } },
          )
        : node('Badge', {
            props: { label: 'Out of Stock', variant: 'default', size: 'md' },
            styling: { className: 'w-full justify-center mt-2' },
          }),
    ],
  });
}

function filterSidebar(
  selectedCategories: string[],
  priceMax: string,
  minRating: string,
  inStockOnly: boolean,
): TimberNode {
  const QUICK_PRICES = ['100', '300', '500', '1000'];
  const RATING_OPTIONS = ['3', '3.5', '4', '4.5'];

  return col({
    styling: { className: 'w-56 shrink-0' },
    children: [
      node('Card', {
        props: { bordered: true, shadow: 'none' },
        children: [
          col({
            props: { gap: 'gap-5' },
            children: [
              // Category section
              col({
                props: { gap: 'gap-2' },
                children: [
                  text('Category', { props: { as: 'h3' }, styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                  ...CATEGORIES.map((cat) =>
                    node('Checkbox', {
                      key: `cat-${cat}`,
                      props: { label: cat, checked: selectedCategories.includes(cat) },
                    }),
                  ),
                ],
              }),
              node('Divider', {}),
              // Price max section
              col({
                props: { gap: 'gap-2' },
                children: [
                  text('Max Price', { props: { as: 'h3' }, styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                  node('Input', {
                    key: 'price-max-input',
                    props: { type: 'number', placeholder: 'e.g. 500', value: priceMax },
                  }),
                  row({
                    props: { gap: 'gap-1.5', wrap: true },
                    children: QUICK_PRICES.map((p) =>
                      btn(
                        `$${p}`,
                        `quick-price-${p}`,
                        priceMax === p ? 'primary' : 'secondary',
                        'sm',
                      ),
                    ),
                  }),
                ],
              }),
              node('Divider', {}),
              // Rating filter
              col({
                props: { gap: 'gap-1.5' },
                children: [
                  text('Min Rating', { props: { as: 'h3' }, styling: { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' } }),
                  ...RATING_OPTIONS.map((r) =>
                    btn(
                      `${'★'.repeat(Math.floor(Number(r)))} ${r}+`,
                      `min-rating-${r}`,
                      minRating === r ? 'primary' : 'ghost',
                      'sm',
                      { styling: { className: 'justify-start' } },
                    ),
                  ),
                ],
              }),
              node('Divider', {}),
              // In-stock only
              node('Checkbox', {
                key: 'in-stock-filter',
                props: { label: 'In Stock Only', checked: inStockOnly },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Search and filter products, returns a full Timber schema
 *     tags:
 *       - Commerce
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: categories
 *         schema: { type: string }
 *         description: Comma-separated category names
 *       - in: query
 *         name: priceMax
 *         schema: { type: string }
 *       - in: query
 *         name: minRating
 *         schema: { type: string }
 *       - in: query
 *         name: inStockOnly
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [relevant, price-asc, price-desc, rating, reviews] }
 *       - in: query
 *         name: cartIds
 *         schema: { type: string }
 *         description: Comma-separated product IDs currently in cart
 *     responses:
 *       200:
 *         description: TimberSchema for the search page
 */
router.get('/', (req: Request, res: Response) => {
  const {
    q = '',
    categories = '',
    priceMax = '',
    minRating = '',
    inStockOnly = 'false',
    sortBy = 'relevant',
    cartIds = '',
  } = req.query as Record<string, string>;

  const qLower          = q.toLowerCase().trim();
  const selectedCats    = categories ? categories.split(',').map((c) => c.trim()).filter(Boolean) : [];
  const priceMaxNum     = priceMax ? Number(priceMax) : null;
  const minRatingNum    = minRating ? Number(minRating) : null;
  const inStock         = inStockOnly === 'true';
  const cartIdSet       = new Set(cartIds ? cartIds.split(',').map(Number) : []);

  const results = applyFilters(qLower, selectedCats, priceMaxNum, minRatingNum, inStock, sortBy);

  // Active filter chips
  const activeChips: TimberNode[] = [
    ...selectedCats.map((cat) =>
      btn(`${cat} ×`, `remove-cat-${cat}`, 'secondary', 'sm'),
    ),
    ...(priceMax ? [btn(`Under $${priceMax} ×`, 'remove-price-max', 'secondary', 'sm')] : []),
    ...(minRating ? [btn(`${minRating}★+ ×`, 'remove-min-rating', 'secondary', 'sm')] : []),
    ...(inStock ? [btn('In Stock ×', 'remove-in-stock', 'secondary', 'sm')] : []),
  ];

  const resultsArea: TimberNode = results.length === 0
    ? col({
        styling: { className: 'flex items-center justify-center py-20 text-center' },
        props: { gap: 'gap-4', align: 'items-center' },
        children: [
          text('🔍', { styling: { className: 'text-5xl' } }),
          text('No results found', { props: { as: 'h3' }, styling: { className: 'text-lg font-semibold text-gray-900 dark:text-gray-100' } }),
          text('Try adjusting your search or clearing some filters.', { styling: { className: 'text-gray-500 dark:text-gray-400' } }),
          btn('Clear all filters', 'clear-all-filters', 'secondary'),
        ],
      })
    : node('Grid', {
        props: { cols: 3, gap: 'gap-4' },
        children: results.map((p) => productCard(p, cartIdSet.has(p.id))),
      });

  const root = col({
    props: { gap: 'gap-6' },
    children: [
      // Search header card
      node('Card', {
        props: { bordered: true, shadow: 'sm' },
        children: [
          col({
            props: { gap: 'gap-3' },
            children: [
              text('Find Your Next Gadget', {
                props: { as: 'h2' },
                styling: { className: 'text-2xl font-bold text-gray-900 dark:text-gray-100' },
              }),
              row({
                props: { gap: 'gap-3', align: 'items-end' },
                children: [
                  node('Input', {
                    key: 'search-input',
                    props: { placeholder: 'Search products, categories…', size: 'lg', value: q },
                    styling: { className: 'flex-1' },
                  }),
                  btn('Search', 'search-btn', 'primary', 'lg'),
                ],
              }),
              ...(activeChips.length > 0
                ? [row({ props: { gap: 'gap-2', wrap: true }, children: [...activeChips, btn('Clear all', 'clear-all-filters', 'ghost', 'sm')] })]
                : []),
            ],
          }),
        ],
      }),

      // Body: sidebar + results
      row({
        props: { gap: 'gap-6', align: 'items-start' },
        children: [
          filterSidebar(selectedCats, priceMax, minRating, inStock),
          col({
            styling: { className: 'flex-1 min-w-0' },
            props: { gap: 'gap-4' },
            children: [
              row({
                props: { justify: 'justify-between', align: 'items-center' },
                children: [
                  text(
                    `${results.length} result${results.length !== 1 ? 's' : ''}${q ? ` for "${q}"` : ''}`,
                    { styling: { className: 'text-sm text-gray-500 dark:text-gray-400' } },
                  ),
                  node('Select', {
                    key: 'sort-select',
                    props: { options: SORT_OPTIONS, value: sortBy },
                    styling: { className: 'w-52' },
                  }),
                ],
              }),
              resultsArea,
            ],
          }),
        ],
      }),
    ],
  });

  res.json(schema('Search', root));
});

export default router;
