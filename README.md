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
  // Safelist dynamic grid classes used by the Grid component
  safelist: [
    { pattern: /^grid-cols-/ },
    { pattern: /^grid-rows-/ },
  ],
};
```

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
| `onClick` | `() => void` | — | Click handler |
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
          <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
            Cancel
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
  type: TimberNodeType;          // 'Row' | 'Column' | 'Grid' | 'Image' | 'Card' | 'Text' | 'Button' | 'Modal' | 'BottomSheet'
  key?: string;                  // stable React key; also used to look up overrides
  props?: Record<string, unknown>;
  styling?: {
    className?: string;          // Tailwind utility classes
    style?: CSSProperties;       // inline styles for dynamic values
  };
  children?: TimberNode[] | string;
  data?: Record<string, unknown>;
}
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
function Badge({ label, color = 'blue' }) {
  return <span className={`badge-${color}`}>{label}</span>;
}

<TimberRenderer
  node={schema.root}
  registry={{ Badge }}
/>
```

Schemas can then use `"type": "Badge"`. Any type not found in the merged registry throws:

```
[TimberRenderer] Unknown component type: "UnknownWidget".
Built-in types are: Row, Column, Grid, Image, Card, Text, Button, Modal, BottomSheet.
To add custom types, pass a "registry" prop with your component map.
```

---

## @timber/sample-server

A minimal Express server that returns `TimberSchema` responses.

### Single endpoint

```
GET /api/details?screen={screenType}&navId={navId}
```

| `screen` | Description |
|---|---|
| `dashboard` | Header row + stats grid + content grid |
| `gallery` | 3-column image grid |
| `card-list` | Scrollable column of article cards |
| `modal` | Page with a button and a Modal node |
| `bottom-sheet` | Page with a button and a BottomSheet node |

Returns `400` with a descriptive error for unknown or missing `screen` values.

### Swagger UI

Full API documentation available at [http://localhost:3001/docs](http://localhost:3001/docs).

### Start

```bash
yarn dev:server
```

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
