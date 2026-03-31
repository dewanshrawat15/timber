import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import {
  Avatar, Badge, Button, Card, Column, Divider, Drawer,
  Input, Modal, Navbar, Progress, Row, Select, Skeleton,
  Spinner, Table, Tabs, Text, Textarea, Toggle, Checkbox,
} from '@timber/core';
import type { TableColumn } from '@timber/core';

/* ─────────────────────────────────────────────── mock data ── */

type Product = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  sales: number;
  imageSeed: string;
  description: string;
  status: 'active' | 'draft';
};

const PRODUCTS: Product[] = [
  { id: 1, title: 'Figma UI Kit Pro',       author: 'DesignLab',    category: 'Design',    price: 49,  rating: 4.9, sales: 1240, imageSeed: 'kit1',    status: 'active', description: 'A comprehensive Figma UI kit with 500+ components, auto-layout variants, and a design system that scales effortlessly across your product.' },
  { id: 2, title: 'CodeSnap CLI',            author: 'devtools.io',  category: 'Dev Tools', price: 29,  rating: 4.7, sales: 890,  imageSeed: 'cli2',    status: 'active', description: 'Capture beautiful terminal screenshots, generate shareable links, and integrate with your CI/CD pipeline in under 5 minutes.' },
  { id: 3, title: 'AI Copywriter Suite',     author: 'NeuralText',   category: 'AI',        price: 79,  rating: 4.8, sales: 2100, imageSeed: 'ai3',     status: 'active', description: 'Generate high-converting copy for landing pages, ads, and emails using fine-tuned LLMs trained on top-performing marketing content.' },
  { id: 4, title: 'TaskFlow Pro',            author: 'FlowApps',     category: 'Productivity', price: 19, rating: 4.5, sales: 670, imageSeed: 'tasks4',  status: 'active', description: 'A beautifully designed Notion-inspired task management template with Kanban, timeline, and OKR tracking all in one workspace.' },
  { id: 5, title: 'Icon Pack 3000',          author: 'PixelForge',   category: 'Design',    price: 15,  rating: 4.6, sales: 3400, imageSeed: 'icons5',  status: 'draft',  description: '3,000 pixel-perfect icons in SVG, PNG, and React component formats. Includes dark/light variants and custom color editor.' },
  { id: 6, title: 'NextJS Starter Kit',      author: 'web3stack',    category: 'Dev Tools', price: 99,  rating: 4.9, sales: 520,  imageSeed: 'next6',   status: 'active', description: 'Production-ready Next.js starter with auth, payments, analytics, and a full admin dashboard. Ship in hours, not weeks.' },
];

const REVIEWS: Record<number, { name: string; stars: number; body: string }[]> = {
  1: [
    { name: 'Sarah K.',   stars: 5, body: 'Best UI kit I have ever bought. Worth every penny.' },
    { name: 'Tom H.',     stars: 5, body: 'Saved me weeks of work on our design system.' },
    { name: 'Priya M.',   stars: 4, body: 'Excellent quality, minor inconsistencies in spacing.' },
  ],
  3: [
    { name: 'Jake R.',    stars: 5, body: 'Our conversion rate jumped 18% after using this.' },
    { name: 'Mei L.',     stars: 5, body: 'Incredibly fast output. The ad copy is on point.' },
    { name: 'Carlos V.',  stars: 4, body: 'Great results for English content; other languages need tuning.' },
  ],
};

const ORDERS = [
  { id: '#10041', customer: 'Alex Johnson',  product: 'Figma UI Kit Pro',    amount: '$49',  date: 'Mar 28',  status: 'Completed' },
  { id: '#10040', customer: 'Maria Garcia',  product: 'AI Copywriter Suite', amount: '$79',  date: 'Mar 27',  status: 'Completed' },
  { id: '#10039', customer: 'James Lee',     product: 'CodeSnap CLI',        amount: '$29',  date: 'Mar 26',  status: 'Refunded' },
  { id: '#10038', customer: 'Sofia Chen',    product: 'NextJS Starter Kit',  amount: '$99',  date: 'Mar 25',  status: 'Completed' },
  { id: '#10037', customer: 'Liam Patel',    product: 'TaskFlow Pro',        amount: '$19',  date: 'Mar 24',  status: 'Pending' },
];

const DASHBOARD_STATS = [
  { label: 'Total Revenue', value: '$12,840', trend: '+18%', up: true },
  { label: 'Total Sales',   value: '8,820',   trend: '+9%',  up: true },
  { label: 'Refund Rate',   value: '2.3%',    trend: '-0.4%', up: false },
  { label: 'Avg Rating',    value: '4.76',    trend: '+0.1',  up: true },
];

const CATEGORIES = [
  { name: 'Design',      count: 142, icon: '🎨' },
  { name: 'Dev Tools',   count: 98,  icon: '🛠️' },
  { name: 'AI',          count: 67,  icon: '🤖' },
  { name: 'Productivity',count: 54,  icon: '⚡' },
];

const CATEGORY_BADGE: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
  Design:      'primary',
  'Dev Tools': 'success',
  AI:          'warning',
  Productivity:'default',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  Pending:   'warning',
  Refunded:  'error',
  active:    'success',
  draft:     'default',
};

/* ─────────────────────────────────────────── table columns ── */

const PRODUCTS_COLUMNS: TableColumn<Product>[] = [
  { key: 'title',    header: 'Product' },
  {
    key: 'category',
    header: 'Category',
    render: (val) => (
      <Badge
        label={val}
        variant={CATEGORY_BADGE[val] ?? 'default'}
        size="sm"
      />
    ),
  },
  {
    key: 'price',
    header: 'Price',
    render: (val) => (
      <Text className="text-sm font-medium">
        ${val}
      </Text>
    ),
  },
  {
    key: 'sales',
    header: 'Sales',
    render: (val) => (
      <Text className="text-sm text-gray-600">
        {val.toLocaleString()}
      </Text>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <Badge
        label={val}
        variant={STATUS_VARIANT[val] ?? 'default'}
        dot
        size="sm"
      />
    ),
  },
];

type OrderRow = (typeof ORDERS)[number];

const ORDERS_COLUMNS: TableColumn<OrderRow>[] = [
  { key: 'id',       header: 'Order' },
  { key: 'customer', header: 'Customer', render: (_val, row) => (
    <Row gap="gap-2" align="items-center">
      <Avatar name={row.customer} size="sm" />
      <Text className="text-sm">{row.customer}</Text>
    </Row>
  )},
  { key: 'product',  header: 'Product' },
  { key: 'amount',   header: 'Amount', render: (val) => <Text className="text-sm font-semibold">{String(val)}</Text> },
  { key: 'date',     header: 'Date' },
  { key: 'status',   header: 'Status', render: (val) => <Badge label={String(val)} variant={STATUS_VARIANT[String(val)] ?? 'default'} dot size="sm" /> },
];

/* ──────────────────────────────────────────────── component ── */

type View = 'home' | 'product' | 'cart' | 'dashboard';

type CartItem = Product & { qty: number };

export function MarketplaceDemo() {
  const [view,               setView]               = useState<View>('home');
  const [selectedProduct,    setSelectedProduct]    = useState<Product>(PRODUCTS[0]);
  const [cartItems,          setCartItems]          = useState<CartItem[]>([]);
  const [activeProductTab,   setActiveProductTab]   = useState('description');
  const [activeDashboardTab, setActiveDashboardTab] = useState('products');
  const [checkoutModalOpen,  setCheckoutModalOpen]  = useState(false);
  const [drawerOpen,         setDrawerOpen]         = useState(false);
  const [promoApplied,       setPromoApplied]       = useState(false);
  const [promoCode,          setPromoCode]          = useState('');
  const [paymentSuccess,     setPaymentSuccess]     = useState(false);
  const [skeletonLoaded,     setSkeletonLoaded]     = useState(false);
  const [saveCard,           setSaveCard]           = useState(false);
  const [newProductPublished, setNewProductPublished] = useState(true);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const total    = subtotal - discount;

  /* ── Navbar shared across views ── */
  const navLinks = [
    { label: 'Home',      href: '#', active: view === 'home',      onClick: () => setView('home')      },
    { label: 'Dashboard', href: '#', active: view === 'dashboard', onClick: () => setView('dashboard') },
  ];

  const navBrand = (
    <Row gap="gap-2" align="items-center">
      <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
        <span className="text-white font-bold text-xs">M</span>
      </div>
      <span className="font-bold text-gray-900">Marketplace</span>
    </Row>
  );

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const navActions = (
    <Row gap="gap-3" align="items-center">
      <Input size="sm" placeholder="Search products…" className="w-44 hidden sm:block" />
      <button
        className="relative"
        onClick={() => setView('cart')}
      >
        <span className="text-sm text-gray-600 hover:text-gray-900">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-3 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>
      <Avatar name="Jordan Lee" size="sm" />
    </Row>
  );

  /* ══════════════════════════════════════ HOME VIEW ══════════ */
  if (view === 'home') return (
    <Column gap="gap-0" className="-mx-6 -mt-8">
      {/* Navbar */}
      <Navbar
        brand={navBrand}
        links={navLinks.map((l) => ({ ...l, onClick: l.label === 'Dashboard' ? () => setView('dashboard') : () => setView('home') }))}
        actions={navActions}
      />

      <div className="max-w-6xl mx-auto w-full px-6 py-8">
        <Column gap="gap-12">
          {/* Hero */}
          <Card shadow="lg" className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
            <Column gap="gap-4">
              <Badge label="New — 300+ products added this month" variant="default" size="sm" />
              <Text as="h1" className="text-3xl font-bold text-white leading-tight">
                Discover Tools Built<br />by Creators, for Creators
              </Text>
              <Text className="text-indigo-100 text-base max-w-lg">
                Premium templates, UI kits, AI tools, and developer utilities — all hand-picked and production-ready.
              </Text>
              <Row gap="gap-3" className="pt-2">
                <Button
                  variant="primary"
                  className="bg-white !text-indigo-700 hover:bg-indigo-50"
                  onClick={() => {}}
                >
                  Browse Products
                </Button>
                <Button variant="ghost" className="!text-white border-white/30 hover:bg-white/10" onClick={() => setView('dashboard')}>
                  Seller Dashboard →
                </Button>
              </Row>
            </Column>
          </Card>

          {/* Featured Products */}
          <Column gap="gap-4">
            <Row justify="justify-between" align="items-center">
              <Text as="h2" className="text-xl font-bold text-gray-900">Featured Products</Text>
              <Text className="text-sm text-indigo-600 cursor-pointer hover:underline">View all →</Text>
            </Row>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.filter((p) => p.status === 'active').map((product) => (
                <Card key={product.id} shadow="md" bordered className="p-0 overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedProduct(product); setActiveProductTab('description'); setView('product'); }}>
                  <img
                    src={`https://picsum.photos/seed/${product.imageSeed}/600/300`}
                    alt={product.title}
                    className="w-full h-36 object-cover"
                  />
                  <Column gap="gap-2" className="p-4 flex-1">
                    <Row justify="justify-between" align="items-start">
                      <Badge label={product.category} variant={CATEGORY_BADGE[product.category] ?? 'default'} size="sm" />
                      <Text className="text-xs text-yellow-500 font-medium">★ {product.rating}</Text>
                    </Row>
                    <Text className="text-sm font-semibold text-gray-900 leading-snug">{product.title}</Text>
                    <Text className="text-xs text-gray-500">by {product.author}</Text>
                    <div className="flex-1" />
                    <Row justify="justify-between" align="items-center" className="pt-1">
                      <Text className="text-base font-bold text-indigo-700">${product.price}</Text>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Row>
                  </Column>
                </Card>
              ))}
            </div>
          </Column>

          {/* Top Categories */}
          <Column gap="gap-4">
            <Text as="h2" className="text-xl font-bold text-gray-900">Top Categories</Text>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <Card key={cat.name} shadow="sm" bordered className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Column gap="gap-1" align="items-center">
                    <span className="text-2xl">{cat.icon}</span>
                    <Text className="text-sm font-semibold text-gray-900">{cat.name}</Text>
                    <Text className="text-xs text-gray-400">{cat.count} items</Text>
                  </Column>
                </Card>
              ))}
            </div>
          </Column>

          {/* Recently Added — with Skeleton */}
          <Column gap="gap-4">
            <Row justify="justify-between" align="items-center">
              <Text as="h2" className="text-xl font-bold text-gray-900">Recently Added</Text>
              <Button size="sm" variant="ghost" onClick={() => setSkeletonLoaded((v) => !v)}>
                {skeletonLoaded ? 'Simulate loading' : 'Load content'}
              </Button>
            </Row>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {skeletonLoaded
                ? PRODUCTS.slice(0, 3).map((p) => (
                    <Card key={p.id} shadow="sm" bordered className="p-3">
                      <Row gap="gap-3" align="items-start">
                        <img src={`https://picsum.photos/seed/${p.imageSeed}/80/80`} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                        <Column gap="gap-0.5" className="flex-1 min-w-0">
                          <Text className="text-sm font-semibold text-gray-900 truncate">{p.title}</Text>
                          <Text className="text-xs text-gray-400">${p.price}</Text>
                        </Column>
                      </Row>
                    </Card>
                  ))
                : [1, 2, 3].map((i) => (
                    <Card key={i} shadow="sm" bordered className="p-3">
                      <Row gap="gap-3" align="items-start">
                        <Skeleton width="3rem" height="3rem" rounded="md" />
                        <Column gap="gap-1.5" className="flex-1">
                          <Skeleton height="0.875rem" width="70%" />
                          <Skeleton height="0.75rem" width="30%" />
                        </Column>
                      </Row>
                    </Card>
                  ))
              }
            </div>
          </Column>
        </Column>
      </div>
    </Column>
  );

  /* ═══════════════════════════════════ PRODUCT DETAIL VIEW ═══ */
  if (view === 'product') {
    const reviews = REVIEWS[selectedProduct.id] ?? REVIEWS[1];
    return (
      <Column gap="gap-0" className="-mx-6 -mt-8">
        <Navbar brand={navBrand} links={navLinks} actions={navActions} />

        <div className="max-w-6xl mx-auto w-full px-6 py-8">
          <Column gap="gap-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-gray-400">
              <button className="hover:text-indigo-600 transition-colors" onClick={() => setView('home')}>Home</button>
              <span>›</span>
              <span>{selectedProduct.category}</span>
              <span>›</span>
              <span className="text-gray-700 font-medium">{selectedProduct.title}</span>
            </nav>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — 2/3 */}
              <div className="lg:col-span-2">
                <Column gap="gap-4">
                  <img
                    src={`https://picsum.photos/seed/${selectedProduct.imageSeed}/900/400`}
                    alt={selectedProduct.title}
                    className="w-full h-56 object-cover rounded-xl"
                  />
                  <Card shadow="md" bordered className="p-0 overflow-hidden">
                    <Tabs
                      tabs={[
                        { key: 'description', label: 'Description' },
                        { key: 'reviews',     label: 'Reviews' },
                        { key: 'changelog',   label: 'Changelog' },
                      ]}
                      activeTab={activeProductTab}
                      onChange={setActiveProductTab}
                      variant="underline"
                    />
                    <div className="p-5">
                      {activeProductTab === 'description' && (
                        <Column gap="gap-4">
                          <Text className="text-sm text-gray-700 leading-relaxed">{selectedProduct.description}</Text>
                          <Divider label="Highlights" />
                          <Column gap="gap-2">
                            {['Instant digital download', 'Lifetime updates included', '24/7 email support', 'Commercial license'].map((f) => (
                              <Row key={f} gap="gap-2" align="items-center">
                                <Badge label="✓" variant="success" size="sm" />
                                <Text className="text-sm text-gray-700">{f}</Text>
                              </Row>
                            ))}
                          </Column>
                        </Column>
                      )}
                      {activeProductTab === 'reviews' && (
                        <Column gap="gap-4">
                          {reviews.map((r) => (
                            <Row key={r.name} gap="gap-3" align="items-start">
                              <Avatar name={r.name} size="sm" />
                              <Column gap="gap-0.5" className="flex-1">
                                <Row gap="gap-2" align="items-center">
                                  <Text className="text-sm font-semibold text-gray-900">{r.name}</Text>
                                  <Text className="text-xs text-yellow-500">{'★'.repeat(r.stars)}</Text>
                                </Row>
                                <Text className="text-sm text-gray-600">{r.body}</Text>
                              </Column>
                            </Row>
                          ))}
                        </Column>
                      )}
                      {activeProductTab === 'changelog' && (
                        <Column gap="gap-3">
                          {[
                            { v: 'v3.0.0', note: 'Complete redesign with new component variants.' },
                            { v: 'v2.5.1', note: 'Performance improvements and minor bug fixes.' },
                            { v: 'v2.0.0', note: 'Added dark mode and accessibility enhancements.' },
                          ].map(({ v, note }) => (
                            <Row key={v} gap="gap-3" align="items-start">
                              <Badge label={v} variant="primary" size="sm" />
                              <Text className="text-sm text-gray-600">{note}</Text>
                            </Row>
                          ))}
                        </Column>
                      )}
                    </div>
                  </Card>

                  {/* Related products */}
                  <Column gap="gap-3">
                    <Text className="text-base font-semibold text-gray-900">Related Products</Text>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PRODUCTS.filter((p) => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 3).concat(PRODUCTS.filter((p) => p.id !== selectedProduct.id).slice(0, 3)).slice(0, 3).map((p) => (
                        <Card key={p.id} shadow="sm" bordered className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedProduct(p); setActiveProductTab('description'); }}>
                          <Column gap="gap-1.5">
                            <Text className="text-sm font-semibold text-gray-900 leading-snug">{p.title}</Text>
                            <Row justify="justify-between" align="items-center">
                              <Text className="text-xs text-gray-400">{p.author}</Text>
                              <Text className="text-sm font-bold text-indigo-700">${p.price}</Text>
                            </Row>
                          </Column>
                        </Card>
                      ))}
                    </div>
                  </Column>
                </Column>
              </div>

              {/* Right — 1/3 sticky purchase card */}
              <div>
                <Card shadow="lg" bordered className="sticky top-4">
                  <Column gap="gap-4">
                    <Text as="h2" className="text-3xl font-bold text-indigo-700">${selectedProduct.price}</Text>
                    <Button variant="primary" size="lg" className="w-full" onClick={() => { addToCart(selectedProduct); setView('cart'); }}>
                      Buy Now
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full" onClick={() => {}}>
                      Preview →
                    </Button>
                    <Divider />
                    <Row gap="gap-3" align="items-center">
                      <Avatar name={selectedProduct.author} size="md" />
                      <Column gap="gap-0">
                        <Text className="text-sm font-semibold text-gray-900">{selectedProduct.author}</Text>
                        <Text className="text-xs text-gray-400">Verified Seller</Text>
                      </Column>
                    </Row>
                    <Divider />
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Column gap="gap-0" align="items-center">
                        <Text className="text-sm font-bold text-gray-900">{selectedProduct.sales.toLocaleString()}</Text>
                        <Text className="text-xs text-gray-400">Sales</Text>
                      </Column>
                      <Column gap="gap-0" align="items-center">
                        <Text className="text-sm font-bold text-yellow-500">★ {selectedProduct.rating}</Text>
                        <Text className="text-xs text-gray-400">Rating</Text>
                      </Column>
                      <Column gap="gap-0" align="items-center">
                        <Text className="text-sm font-bold text-gray-900">∞</Text>
                        <Text className="text-xs text-gray-400">Updates</Text>
                      </Column>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <Text className="text-xs text-indigo-700 font-medium">✓ 30-day money-back guarantee</Text>
                    </div>
                  </Column>
                </Card>
              </div>
            </div>
          </Column>
        </div>
      </Column>
    );
  }

  /* ═══════════════════════════════════════ CART / CHECKOUT ═══ */
  if (view === 'cart') return (
    <Column gap="gap-0" className="-mx-6 -mt-8">
      <Navbar brand={navBrand} links={navLinks.map((l) => ({ ...l, onClick: l.label === 'Dashboard' ? () => setView('dashboard') : () => setView('home') }))} actions={navActions} />

      <div className="max-w-6xl mx-auto w-full px-6 py-8">
        <Column gap="gap-6">
          <nav className="flex items-center gap-1 text-sm text-gray-400">
            <button className="hover:text-indigo-600 transition-colors" onClick={() => setView('home')}>Home</button>
            <span>›</span>
            <span className="text-gray-700 font-medium">Cart</span>
          </nav>

          <Text as="h1" className="text-2xl font-bold text-gray-900">Your Cart</Text>

          {cartItems.length === 0 ? (
            <Card shadow="sm" bordered className="text-center py-12">
              <Column gap="gap-3" align="items-center">
                <Text className="text-4xl">🛒</Text>
                <Text className="text-lg font-semibold text-gray-700">Your cart is empty</Text>
                <Text className="text-sm text-gray-400">Add some products to get started.</Text>
                <Button variant="primary" onClick={() => setView('home')}>Browse Products</Button>
              </Column>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — cart items */}
              <div className="lg:col-span-2">
                <Column gap="gap-3">
                  {cartItems.map((item) => (
                    <Card key={item.id} shadow="sm" bordered>
                      <Row gap="gap-4" align="items-center">
                        <img
                          src={`https://picsum.photos/seed/${item.imageSeed}/120/80`}
                          alt={item.title}
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <Column gap="gap-0.5" className="flex-1 min-w-0">
                          <Text className="text-sm font-semibold text-gray-900 truncate">{item.title}</Text>
                          <Text className="text-xs text-gray-400">by {item.author}</Text>
                          <Badge label={item.category} variant={CATEGORY_BADGE[item.category] ?? 'default'} size="sm" />
                        </Column>
                        <Column gap="gap-1" align="items-end">
                          <Text className="text-base font-bold text-indigo-700">${item.price * item.qty}</Text>
                          <Button variant="ghost" size="sm" className="!text-red-500 hover:!bg-red-50" onClick={() => removeFromCart(item.id)}>
                            Remove
                          </Button>
                        </Column>
                      </Row>
                    </Card>
                  ))}

                  <Divider />

                  {/* Promo code */}
                  <Row gap="gap-2" align="items-end">
                    <div className="flex-1">
                      <Input
                        label="Promo code"
                        placeholder="SAVE15"
                        value={promoCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                        size="sm"
                      />
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}>
                      Apply
                    </Button>
                  </Row>
                  {promoApplied && (
                    <div className="bg-green-50 rounded-lg px-3 py-2">
                      <Text className="text-sm text-green-700 font-medium">✓ Promo code applied — 15% off!</Text>
                    </div>
                  )}
                </Column>
              </div>

              {/* Right — order summary */}
              <div>
                <Card shadow="lg" bordered>
                  <Column gap="gap-3">
                    <Text className="text-base font-semibold text-gray-900">Order Summary</Text>
                    <Divider />
                    <Row justify="justify-between">
                      <Text className="text-sm text-gray-600">Subtotal</Text>
                      <Text className="text-sm font-medium">${subtotal}</Text>
                    </Row>
                    {promoApplied && (
                      <Row justify="justify-between">
                        <Text className="text-sm text-gray-600">Discount</Text>
                        <Badge label={`-$${discount}`} variant="success" size="sm" />
                      </Row>
                    )}
                    <Divider />
                    <Row justify="justify-between">
                      <Text className="text-base font-bold text-gray-900">Total</Text>
                      <Text className="text-base font-bold text-indigo-700">${total}</Text>
                    </Row>
                    <Button variant="primary" className="w-full" onClick={() => setCheckoutModalOpen(true)}>
                      Proceed to Checkout
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setView('home')}>
                      Continue Shopping
                    </Button>
                  </Column>
                </Card>
              </div>
            </div>
          )}
        </Column>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => { setCheckoutModalOpen(false); setPaymentSuccess(false); }}
        title="Checkout"
        size="md"
      >
        {paymentSuccess ? (
          <Column gap="gap-4" align="items-center" className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <Text as="h3" className="text-xl font-bold text-gray-900">Payment successful!</Text>
            <Text className="text-sm text-gray-500">Your downloads are ready. Check your email for receipt and links.</Text>
            <Button variant="primary" onClick={() => { setCheckoutModalOpen(false); setCartItems([]); setPaymentSuccess(false); setView('home'); }}>
              Back to Marketplace
            </Button>
          </Column>
        ) : (
          <Column gap="gap-4">
            <Tabs
              tabs={[{ key: 'card', label: 'Card' }, { key: 'paypal', label: 'PayPal' }]}
              activeTab="card"
              onChange={() => {}}
              variant="pills"
            />
            <Input label="Card number" placeholder="1234 5678 9012 3456" />
            <Row gap="gap-3">
              <div className="flex-1"><Input label="Expiry" placeholder="MM / YY" /></div>
              <div className="flex-1"><Input label="CVV" placeholder="123" /></div>
            </Row>
            <Input label="Name on card" placeholder="Jordan Lee" />
            <Toggle checked={saveCard} onChange={setSaveCard} label="Save card for future purchases" size="sm" />
            <Divider />
            <Row justify="justify-between" align="items-center">
              <Text className="text-sm text-gray-600">Total due: <span className="font-bold text-gray-900">${total}</span></Text>
              <Button variant="primary" onClick={() => setPaymentSuccess(true)}>
                Pay ${total}
              </Button>
            </Row>
          </Column>
        )}
      </Modal>
    </Column>
  );

  /* ══════════════════════════════════ SELLER DASHBOARD VIEW ══ */
  return (
    <Column gap="gap-0" className="-mx-6 -mt-8">
      <Navbar brand={navBrand} links={navLinks.map((l) => ({ ...l, onClick: l.label === 'Dashboard' ? () => setView('dashboard') : () => setView('home') }))} actions={navActions} />

      <div className="max-w-6xl mx-auto w-full px-6 py-8">
        <Column gap="gap-6">
          <nav className="flex items-center gap-1 text-sm text-gray-400">
            <span className="text-gray-700 font-medium">Dashboard</span>
          </nav>

          <Row justify="justify-between" align="items-center">
            <Text as="h1" className="text-2xl font-bold text-gray-900">Seller Dashboard</Text>
            <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
              + Add New Product
            </Button>
          </Row>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_STATS.map((stat) => (
              <Card key={stat.label} shadow="md" bordered>
                <Column gap="gap-1">
                  <Text className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</Text>
                  <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
                  <Badge
                    label={`${stat.up ? '↑' : '↓'} ${stat.trend}`}
                    variant={stat.up ? 'success' : 'error'}
                    size="sm"
                  />
                </Column>
              </Card>
            ))}
          </div>

          {/* Main tabs */}
          <Card shadow="md" bordered className="p-0 overflow-hidden">
            <div className="px-5 pt-4">
              <Tabs
                tabs={[
                  { key: 'products', label: 'Products' },
                  { key: 'orders',   label: 'Orders' },
                  { key: 'analytics',label: 'Analytics' },
                ]}
                activeTab={activeDashboardTab}
                onChange={setActiveDashboardTab}
                variant="underline"
              />
            </div>

            <div className="p-5">
              {activeDashboardTab === 'products' && (
                <Table columns={PRODUCTS_COLUMNS} rows={PRODUCTS} striped />
              )}

              {activeDashboardTab === 'orders' && (
                <Table columns={ORDERS_COLUMNS} rows={ORDERS} striped />
              )}

              {activeDashboardTab === 'analytics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Column gap="gap-4">
                    <Text className="text-sm font-semibold text-gray-900">Top Products by Sales</Text>
                    {PRODUCTS.sort((a, b) => b.sales - a.sales).slice(0, 4).map((p) => (
                      <Column key={p.id} gap="gap-1">
                        <Row justify="justify-between">
                          <Text className="text-xs text-gray-700">{p.title}</Text>
                          <Text className="text-xs text-gray-400">{p.sales.toLocaleString()}</Text>
                        </Row>
                        <Progress
                          value={Math.round((p.sales / 3400) * 100)}
                          size="sm"
                          color="indigo"
                        />
                      </Column>
                    ))}
                  </Column>
                  <Column gap="gap-4">
                    <Text className="text-sm font-semibold text-gray-900">Revenue by Category</Text>
                    {Object.entries(
                      PRODUCTS.reduce<Record<string, number>>((acc, p) => {
                        acc[p.category] = (acc[p.category] ?? 0) + p.price * p.sales;
                        return acc;
                      }, {})
                    ).map(([cat, rev]) => (
                      <Column key={cat} gap="gap-1">
                        <Row justify="justify-between">
                          <Text className="text-xs text-gray-700">{cat}</Text>
                          <Text className="text-xs text-gray-400">${(rev / 1000).toFixed(1)}k</Text>
                        </Row>
                        <Progress
                          value={Math.round((rev / 210000) * 100)}
                          size="sm"
                          color="green"
                        />
                      </Column>
                    ))}
                  </Column>
                </div>
              )}
            </div>
          </Card>
        </Column>
      </div>

      {/* Add New Product Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add New Product" side="right" size="md">
        <Column gap="gap-4">
          <Input label="Product title" placeholder="Enter product name…" />
          <Textarea label="Description" placeholder="Describe your product…" rows={4} />
          <Select
            label="Category"
            value="design"
            onChange={() => {}}
            options={[
              { label: 'Design',      value: 'design' },
              { label: 'Dev Tools',   value: 'dev' },
              { label: 'AI',          value: 'ai' },
              { label: 'Productivity',value: 'productivity' },
            ]}
          />
          <Input label="Price ($)" type="number" placeholder="0.00" />
          <Divider />
          <Toggle
            checked={newProductPublished}
            onChange={setNewProductPublished}
            label="Published"
            description="Make visible on marketplace immediately"
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="I confirm this product is original"
          />
          <Row justify="justify-end" gap="gap-3" className="pt-2">
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setDrawerOpen(false)}>
              <Row gap="gap-2" align="items-center">
                <Spinner size="sm" color="white" />
                <span>Saving…</span>
              </Row>
            </Button>
          </Row>
        </Column>
      </Drawer>
    </Column>
  );
}
