# Timber

A server-driven React component library built with TypeScript, TailwindCSS, and HeadlessUI.

Timber lets your backend control UI layout by returning structured JSON schemas that `TimberRenderer` renders into a full component tree. Components can also be used directly in any React project.

## Monorepo structure

```
packages/
├── core/           # @timber/core — the component library
├── sample-server/  # @timber/sample-server — demo Express API
└── demo/           # @timber/demo — Vite demo app
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Yarn 1.22+

### Install

```bash
yarn install
```

### Run everything

```bash
# Build the component library
yarn build

# Start the sample API server (port 3001)
yarn dev:server

# Start the demo app (port 5173)
yarn dev:demo
```

Open [http://localhost:5173](http://localhost:5173) to explore the demo.
Open [http://localhost:3001/docs](http://localhost:3001/docs) for the Swagger API reference.

---

## @timber/core

### Installation (in a consuming project)

```bash
# npm
npm install @timber/core

# yarn
yarn add @timber/core

# Install peer dependencies
npm install react react-dom @headlessui/react tailwindcss
```

### Tailwind configuration

Timber does not bundle any CSS. Configure your project's `tailwind.config.ts` to scan Timber's built output so its utility classes are included:

```ts
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@timber/core/dist/**/*.js',
  ],
  // Enable class-based dark mode (toggled by adding "dark" to a root element)
  darkMode: 'class',
  // Safelist dynamic grid classes used by the Grid component
  safelist: [
    { pattern: /^grid-cols-/ },
    { pattern: /^grid-rows-/ },
  ],
};
```

### Dark mode

All Timber components ship with `dark:` variants for every color. Enable dark mode by adding the `dark` class to any ancestor element — typically the document root:

```tsx
// Toggle dark mode in your app
function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      {/* All Timber components inside here respond to dark mode */}
      <Button onClick={() => setDark(d => !d)}>Toggle theme</Button>
    </div>
  );
}
```

> **Note for dynamic server-driven classes:** If your server sends Tailwind utility classes inside JSON (e.g. gradient classes on a custom component), those strings are not statically scanned by Tailwind's purge step and will be missing from the compiled CSS. Use inline `style` props for any truly dynamic values — for example, pass a CSS `linear-gradient()` string rather than `from-blue-600 to-blue-900`.

Add the Tailwind directives to your global CSS:

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Components

### Layout

#### `Row`

A horizontal flex container.

```tsx
import { Row } from '@timber/core';

<Row gap="gap-4" align="items-center" justify="justify-between" wrap>
  <div>Left</div>
  <div>Right</div>
</Row>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `gap` | `string` | — | Tailwind gap class, e.g. `"gap-4"` |
| `align` | `string` | — | Tailwind `items-*` class |
| `justify` | `string` | — | Tailwind `justify-*` class |
| `wrap` | `boolean` | `false` | Enables `flex-wrap` |
| `className` | `string` | — | Additional Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

#### `Column`

A vertical flex container.

```tsx
import { Column } from '@timber/core';

<Column gap="gap-3" align="items-center">
  <div>First</div>
  <div>Second</div>
</Column>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `gap` | `string` | — | Tailwind gap class |
| `align` | `string` | — | Tailwind `items-*` class |
| `justify` | `string` | — | Tailwind `justify-*` class |
| `className` | `string` | — | Additional Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

#### `Grid`

A CSS grid container.

```tsx
import { Grid } from '@timber/core';

<Grid cols={3} gap="gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `cols` | `number` | — | Number of columns (1–12) |
| `rows` | `number` | — | Number of rows (1–6) |
| `gap` | `string` | — | Tailwind gap class |
| `className` | `string` | — | Additional Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

### Display

#### `Text`

A polymorphic text element.

```tsx
import { Text } from '@timber/core';

<Text as="h1" className="text-2xl font-bold">Hello</Text>
<Text as="p" className="text-gray-500">Subtitle</Text>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `'p' \| 'span' \| 'h1'–'h6' \| 'label'` | `'p'` | HTML tag to render |
| `className` | `string` | — | Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

#### `Button`

```tsx
import { Button } from '@timber/core';

<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `disabled` | `boolean` | `false` | Disabled state |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | — | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `className` | `string` | — | Additional Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

#### `Image`

```tsx
import { Image } from '@timber/core';

<Image
  src="https://example.com/photo.jpg"
  alt="A photo"
  objectFit="cover"
  className="w-full h-48 rounded-lg"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | **required** | Image URL |
| `alt` | `string` | **required** | Alt text |
| `objectFit` | `'cover' \| 'contain' \| 'fill' \| 'none'` | `'cover'` | CSS object-fit |
| `width` | `number \| string` | — | Width attribute |
| `height` | `number \| string` | — | Height attribute |
| `className` | `string` | — | Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

#### `Card`

```tsx
import { Card } from '@timber/core';

<Card title="Revenue" subtitle="Last 30 days" shadow="md" bordered>
  <Text className="text-3xl font-bold text-green-600">$48,200</Text>
</Card>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card heading |
| `subtitle` | `string` | — | Secondary text below title |
| `footer` | `ReactNode` | — | Content rendered below a divider |
| `bordered` | `boolean` | `false` | Adds a border |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Box shadow |
| `onClick` | `MouseEventHandler<HTMLDivElement>` | — | Makes the card interactive; adds `cursor-pointer` |
| `className` | `string` | — | Additional Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

---

### Overlay

#### `Modal`

Built on HeadlessUI `Dialog` with a fade + scale transition.

```tsx
import { useState } from 'react';
import { Modal, Button } from '@timber/core';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm"
        description="Are you sure?"
        size="md"
      >
        <Button variant="destructive" onClick={() => setOpen(false)}>
          Confirm
        </Button>
      </Modal>
    </>
  );
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | **required** | Controls visibility |
| `onClose` | `() => void` | **required** | Called when backdrop or Escape is pressed |
| `title` | `string` | — | Dialog title |
| `description` | `string` | — | Dialog description |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Max width of the panel |
| `className` | `string` | — | Additional Tailwind classes on the panel |

---

#### `BottomSheet`

A modal anchored to the bottom of the viewport with a slide-up transition.

```tsx
import { useState } from 'react';
import { BottomSheet, Button, Column } from '@timber/core';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Options">
        <Column gap="gap-3">
          <Button variant="secondary" className="w-full" onClick={() => setOpen(false)}>
            Share
          </Button>
        </Column>
      </BottomSheet>
    </>
  );
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | **required** | Controls visibility |
| `onClose` | `() => void` | **required** | Called when backdrop or Escape is pressed |
| `title` | `string` | — | Sheet title |
| `maxHeight` | `string` | `'max-h-[80vh]'` | Tailwind `max-h-*` class |
| `className` | `string` | — | Additional Tailwind classes on the panel |

---

### Form

#### `Input`

```tsx
import { Input } from '@timber/core';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  hint="We'll never share your email."
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text above the input |
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Uncontrolled default value |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Change handler |
| `hint` | `string` | — | Helper text below the input |
| `error` | `string` | — | Error message (renders input in error state) |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input height |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Textarea`

```tsx
import { Textarea } from '@timber/core';

<Textarea
  label="Bio"
  placeholder="Tell us about yourself…"
  rows={4}
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text |
| `placeholder` | `string` | — | Placeholder text |
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Uncontrolled default value |
| `onChange` | `ChangeEventHandler<HTMLTextareaElement>` | — | Change handler |
| `rows` | `number` | `3` | Number of visible rows |
| `hint` | `string` | — | Helper text |
| `error` | `string` | — | Error message |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Select`

Built on HeadlessUI `Listbox` for full keyboard and screen-reader support.

```tsx
import { Select } from '@timber/core';

<Select
  label="Plan"
  value={plan}
  onChange={setPlan}
  options={[
    { label: 'Free', value: 'free' },
    { label: 'Pro — $12/mo', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text |
| `value` | `string` | **required** | Currently selected value |
| `onChange` | `(value: string) => void` | **required** | Called with the new value |
| `options` | `{ label: string; value: string }[]` | **required** | Available options |
| `placeholder` | `string` | — | Shown when value is empty |
| `error` | `string` | — | Error message |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Checkbox`

Built on HeadlessUI for accessibility.

```tsx
import { Checkbox } from '@timber/core';

<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="I agree to the Terms of Service"
  description="You must accept to continue."
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | **required** | Checked state |
| `onChange` | `(checked: boolean) => void` | **required** | Change handler |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Secondary text below label |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Toggle`

A switch built on HeadlessUI `Switch`.

```tsx
import { Toggle } from '@timber/core';

<Toggle
  checked={notifications}
  onChange={setNotifications}
  label="Email notifications"
  description="Receive updates via email."
  size="md"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | **required** | On/off state |
| `onChange` | `(checked: boolean) => void` | **required** | Change handler |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Secondary text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggle size |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Additional Tailwind classes |

---

### Feedback

#### `Badge`

```tsx
import { Badge } from '@timber/core';

<Badge label="Active" variant="success" dot size="sm" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | **required** | Badge text |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `dot` | `boolean` | `false` | Shows a colored dot before the label |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Alert`

```tsx
import { Alert } from '@timber/core';

<Alert
  variant="warning"
  title="Storage almost full"
  description="You've used 90% of your quota."
  dismissible
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Color and icon style |
| `title` | `string` | — | Bold heading |
| `description` | `string` | — | Body text |
| `dismissible` | `boolean` | `false` | Shows a close button |
| `onDismiss` | `() => void` | — | Called when dismissed (optional; component manages internal state) |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Spinner`

```tsx
import { Spinner } from '@timber/core';

<Spinner size="md" color="indigo" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner diameter |
| `color` | `'indigo' \| 'green' \| 'red' \| 'gray' \| 'white'` | `'indigo'` | Spinner color |
| `label` | `string` | `'Loading…'` | Screen-reader accessible label |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Skeleton`

```tsx
import { Skeleton } from '@timber/core';

{/* Single bar */}
<Skeleton height="1rem" width="60%" rounded="md" />

{/* Multi-line text placeholder */}
<Skeleton lines={3} />

{/* Avatar placeholder */}
<Skeleton width="3rem" height="3rem" rounded="full" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `string` | `'100%'` | CSS width |
| `height` | `string` | `'1rem'` | CSS height |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Border radius |
| `lines` | `number` | — | Renders N stacked lines of varying width |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Progress`

```tsx
import { Progress } from '@timber/core';

<Progress value={72} color="indigo" label="Upload" showLabel size="md" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | **required** | Current value (0–`max`) |
| `max` | `number` | `100` | Maximum value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar height |
| `color` | `'indigo' \| 'green' \| 'yellow' \| 'red'` | `'indigo'` | Fill color |
| `label` | `string` | — | Text shown above the bar |
| `showLabel` | `boolean` | `false` | Also shows the percentage value |
| `className` | `string` | — | Additional Tailwind classes |

---

### Navigation

#### `Tabs`

Built on HeadlessUI `TabGroup`.

```tsx
import { Tabs } from '@timber/core';

<Tabs
  tabs={[
    { key: 'overview', label: 'Overview' },
    { key: 'settings', label: 'Settings' },
    { key: 'billing',  label: 'Billing', disabled: true },
  ]}
  activeTab={tab}
  onChange={setTab}
  variant="underline"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `{ key: string; label: string; disabled?: boolean }[]` | **required** | Tab definitions |
| `activeTab` | `string` | **required** | Key of the currently active tab |
| `onChange` | `(key: string) => void` | **required** | Called with the key of the clicked tab |
| `variant` | `'underline' \| 'pills'` | `'underline'` | Visual style |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Breadcrumb`

```tsx
import { Breadcrumb } from '@timber/core';

<Breadcrumb
  items={[
    { label: 'Home',      href: '/' },
    { label: 'Products',  href: '/products' },
    { label: 'Detail' },
  ]}
  separator="/"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ label: string; href?: string }[]` | **required** | Breadcrumb items. Last item is always non-linked. |
| `separator` | `string` | `'/'` | Separator character between items |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Navbar`

```tsx
import { Navbar, Button } from '@timber/core';

<Navbar
  brand={<span className="font-bold text-gray-900">Acme</span>}
  links={[
    { label: 'Home',    href: '/',        active: true },
    { label: 'Pricing', href: '/pricing'              },
  ]}
  actions={
    <>
      <Button variant="ghost" size="sm">Log in</Button>
      <Button variant="primary" size="sm">Sign up</Button>
    </>
  }
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `brand` | `ReactNode` | — | Logo / wordmark rendered on the left |
| `links` | `{ label: string; href?: string; active?: boolean; onClick?: () => void }[]` | — | Navigation links |
| `actions` | `ReactNode` | — | Slot rendered on the right (buttons, avatar, etc.) |
| `sticky` | `boolean` | `false` | Sticks the navbar to the top of the viewport |
| `className` | `string` | — | Additional Tailwind classes |

---

### Data

#### `Avatar`

```tsx
import { Avatar } from '@timber/core';

{/* With image */}
<Avatar src="https://example.com/avatar.jpg" alt="Jordan Lee" size="md" />

{/* Initials fallback */}
<Avatar name="Jordan Lee" size="md" shape="circle" />

{/* No src or name — generic placeholder */}
<Avatar size="md" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL |
| `alt` | `string` | — | Alt text for the image |
| `name` | `string` | — | Used to generate initials and a deterministic background color when no `src` is provided |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar diameter |
| `shape` | `'circle' \| 'square'` | `'circle'` | Border radius |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Divider`

```tsx
import { Divider } from '@timber/core';

{/* Horizontal */}
<Divider label="or continue with" />

{/* Vertical (inside a Row) */}
<Row className="h-8">
  <span>Home</span>
  <Divider orientation="vertical" />
  <span>About</span>
</Row>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction |
| `label` | `string` | — | Optional centred label (horizontal only) |
| `className` | `string` | — | Additional Tailwind classes |

---

#### `Table`

```tsx
import { Table } from '@timber/core';
import type { TableColumn } from '@timber/core';

const columns: TableColumn[] = [
  { key: 'name',  header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => <Badge label={String(val)} variant="success" size="sm" />,
  },
];

<Table columns={columns} rows={users} striped emptyMessage="No users found." />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `TableColumn[]` | **required** | Column definitions |
| `rows` | `Record<string, unknown>[]` | **required** | Data rows |
| `striped` | `boolean` | `false` | Alternating row background |
| `bordered` | `boolean` | `false` | Adds cell borders |
| `emptyMessage` | `string` | `'No data.'` | Shown when `rows` is empty |
| `className` | `string` | — | Additional Tailwind classes |

**`TableColumn` shape:**

```ts
interface TableColumn {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}
```

---

#### `Drawer`

A side panel built on HeadlessUI `Dialog`.

```tsx
import { useState } from 'react';
import { Drawer, Button } from '@timber/core';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer isOpen={open} onClose={() => setOpen(false)} title="Settings" side="right" size="md">
        <p>Drawer content here.</p>
      </Drawer>
    </>
  );
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | **required** | Controls visibility |
| `onClose` | `() => void` | **required** | Called when backdrop or Escape is pressed |
| `title` | `string` | — | Panel heading |
| `side` | `'left' \| 'right'` | `'right'` | Which edge to slide in from |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Panel width |
| `className` | `string` | — | Additional Tailwind classes on the panel |

---

## TimberRenderer

`TimberRenderer` accepts a `TimberNode` (the `root` of a `TimberSchema`) and recursively renders the full component tree.

```tsx
import { TimberRenderer } from '@timber/core';
import type { TimberSchema } from '@timber/core';

const schema: TimberSchema = {
  version: '1.0',
  root: {
    type: 'Column',
    styling: { className: 'p-6 gap-4' },
    children: [
      {
        type: 'Text',
        props: { as: 'h1' },
        styling: { className: 'text-2xl font-bold' },
        children: 'Hello from the server',
      },
      {
        type: 'Button',
        key: 'cta',
        props: { variant: 'primary' },
        children: 'Get started',
      },
    ],
  },
};

<TimberRenderer
  node={schema.root}
  overrides={{
    cta: { onClick: () => console.log('clicked') },
  }}
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `node` | `TimberNode` | The node to render (pass `schema.root` for the full tree) |
| `overrides` | `Record<string, Record<string, unknown>>` | Runtime props keyed by `node.key` — use this to inject event handlers and state that cannot be serialized in JSON |
| `registry` | `Record<string, ComponentType>` | Custom components merged with the default registry |

### Schema shape

```ts
interface TimberSchema {
  version: string;
  name?: string;
  root: TimberNode;
}

interface TimberNode {
  type: TimberNodeType;
  key?: string;                   // stable React key; also used to look up overrides
  props?: Record<string, unknown>;
  styling?: {
    className?: string;           // Tailwind utility classes
    style?: CSSProperties;        // inline styles for dynamic values
  };
  children?: TimberNode[] | string;
  data?: Record<string, unknown>;
}

type TimberNodeType =
  // Layout
  'Row' | 'Column' | 'Grid' |
  // Display
  'Image' | 'Card' | 'Text' | 'Button' |
  // Overlay
  'Modal' | 'BottomSheet' |
  // Form
  'Input' | 'Textarea' | 'Select' | 'Checkbox' | 'Toggle' |
  // Feedback
  'Badge' | 'Alert' | 'Spinner' | 'Skeleton' | 'Progress' |
  // Navigation
  'Tabs' | 'Breadcrumb' | 'Navbar' |
  // Data
  'Avatar' | 'Divider' | 'Table' | 'Drawer';
```

### Handling interactive state

JSON cannot carry functions, so `isOpen`, `onClose`, `onClick`, etc. must come from the consuming app. Use the `overrides` prop keyed by `node.key`:

```tsx
const [open, setOpen] = useState(false);

<TimberRenderer
  node={schema.root}
  overrides={{
    'open-btn':   { onClick: () => setOpen(true) },
    'my-modal':   { isOpen: open, onClose: () => setOpen(false) },
  }}
/>
```

### Extending the registry

Pass custom components via the `registry` prop. They are merged with the built-in registry:

```tsx
function Tag({ label, color = 'blue' }) {
  return <span className={`badge badge-${color}`}>{label}</span>;
}

<TimberRenderer node={schema.root} registry={{ Tag }} />
```

Schemas can then use `"type": "Tag"`. Any type not found in the merged registry throws a descriptive error:

```
[TimberRenderer] Unknown component type: "UnknownWidget".
Built-in types are: Row, Column, Grid, ...
To add custom types, pass a "registry" prop with your component map.
```

---

## @timber/sample-server

A minimal Express server that returns `TimberSchema` responses. All business logic (filtering, totals, validation, formatting) lives on the server — the client only holds query params and event handlers.

### Endpoints

#### `GET /api/details?screen={screenType}`

General-purpose layout endpoint.

| `screen` | Description |
|---|---|
| `dashboard` | Header row + stats grid + content grid |
| `gallery` | 3-column image grid |
| `card-list` | Scrollable column of article cards |
| `modal` | Page with a button and a Modal node |
| `bottom-sheet` | Page with a button and a BottomSheet node |
| `settings` | Settings page with Input, Select, and Toggle groups |
| `profile` | Profile page with Avatar + stats grid |
| `data-table` | Card wrapping a Table with 5 rows of user data |
| `form-page` | Column with Input, Textarea, Select, Checkbox, Toggle |
| `feedback-page` | Column of Alert variants, Badge row, Spinner, Progress |

Returns `400` with a descriptive error for unknown or missing `screen` values.

---

#### `GET /api/search`

Product search with server-side filtering and sorting.

| Param | Type | Description |
|---|---|---|
| `q` | `string` | Search query (matches name and category) |
| `categories` | `string` | Comma-separated category names, e.g. `Audio,Laptops` |
| `priceMax` | `string` | Maximum price filter |
| `minRating` | `string` | Minimum rating filter (e.g. `4.5`) |
| `inStockOnly` | `'true'` | Filter to in-stock products only |
| `sortBy` | `'relevant' \| 'price-asc' \| 'price-desc' \| 'rating' \| 'reviews'` | Sort order |
| `cartIds` | `string` | Comma-separated product IDs already in cart (used to toggle button variants) |

Returns a schema with a filter sidebar (Checkbox per category with `checked` set server-side), a results Grid, and an empty state. Filter chip buttons carry keys like `remove-cat-Audio` so the client can wire up removal via `overrides`.

---

#### `GET /api/cart`

Cart totals computed server-side.

| Param | Type | Description |
|---|---|---|
| `items` | `string` | Comma-separated `id:qty` pairs, e.g. `1:2,5:1` |
| `promoCode` | `string` | Promo code to apply (`TIMBER10`, `SAVE20`, `NEWUSER`) |
| `giftWrap` | `'true'` | Add gift wrapping fee ($5.99) |

The server computes subtotal, shipping (free ≥ $200), promo discount, 8% tax, and total. Nodes use stable keys — `qty-dec-{id}`, `qty-inc-{id}`, `remove-item-{id}`, `promo-input`, `promo-apply-btn`, `gift-wrap-toggle`, `checkout-btn` — so the client wires up all interactions via `overrides`.

---

#### `GET /api/product`

Full product detail page schema.

| Param | Type | Description |
|---|---|---|
| `id` | `integer` | Product ID (1–12) |
| `color` | `string` | Selected color variant |
| `size` | `string` | Selected size variant |
| `qty` | `integer` | Quantity (1–10) |
| `tab` | `'description' \| 'specs' \| 'reviews'` | Active detail tab |
| `addedToCart` | `'true'` | Toggles the Add to Cart button to "✓ In Cart" |

Color and size selector buttons carry keys `color-{color}` and `size-{size}`. The active button renders with `variant: 'primary'`; inactive buttons use `variant: 'secondary'`. Tab component key is `detail-tabs`.

Returns `404` for unknown product IDs.

---

#### `GET /api/checkout`

Multi-step checkout flow.

| Param | Type | Description |
|---|---|---|
| `step` | `1 \| 2 \| 3 \| 4` | Current checkout step (Review → Shipping → Payment → Confirm) |
| `method` | `'card' \| 'paypal' \| 'applepay'` | Payment method (step 3) |
| `promoCode` | `string` | Applied promo code (reflected in the order summary sidebar) |

The server renders a visual step indicator (circles + connectors with dynamic CSS classes for done/active/pending states) and a persistent order summary sidebar. Navigation uses keys `next-step-btn` and `prev-step-btn`. Payment method selection key is `payment-method-select`.

---

#### `GET /api/credit-card`

Credit card entry form with live brand detection and number formatting.

| Param | Type | Description |
|---|---|---|
| `number` | `string` | Raw card digits (server formats and detects brand) |
| `name` | `string` | Cardholder name |
| `expiry` | `string` | Raw digits (server formats to `MM/YY`) |
| `cvv` | `string` | CVV (server masks to `•••`) |
| `flipped` | `'true'` | Shows the card back face |

Brand is detected from the number prefix (Visa `4`, Mastercard `51-55`, Amex `34/37`, Discover `6`). The server returns a `CreditCardVisual` node (a custom component type the client must register via `registry`) with all formatted props including a CSS `linear-gradient` string for the card background. Input keys: `card-number-input`, `card-name-input`, `card-expiry-input`, `card-cvv-input`.

---

### Swagger UI

Full API documentation available at [http://localhost:3001/docs](http://localhost:3001/docs).

### Start

```bash
yarn dev:server
```

---

## Custom components

See [packages/core/CONTRIBUTING.md](packages/core/CONTRIBUTING.md) for a complete step-by-step guide to adding your own components — including a full worked `Tag` component example, HeadlessUI usage patterns, styling conventions, and a TypeScript checklist.

---

## Development

```bash
# Install all workspace dependencies
yarn install

# Build @timber/core (outputs ESM + CJS + types to packages/core/dist/)
yarn build

# Type-check all packages
yarn typecheck

# Watch mode for the library
yarn workspace @timber/core dev

# Start the sample server (tsx watch)
yarn dev:server

# Start the demo app (Vite HMR)
yarn dev:demo
```

### Package outputs (`@timber/core`)

| File | Format | Usage |
|---|---|---|
| `dist/index.js` | ESM | Vite, Next.js, modern bundlers |
| `dist/index.cjs` | CJS | Jest, Node.js `require()` |
| `dist/index.d.ts` | TypeScript declarations | Full type safety in consuming projects |
