# Adding Custom Components to Timber

This guide walks you through every step required to add your own component to the Timber library and make it available inside `TimberRenderer` JSON schemas.

---

## Prerequisites

Before you start, make sure you understand:

- **`TimberNode`** — the JSON shape the server returns. Each node has a `type`, optional `props`, optional `styling`, optional `children`, and an optional `data` payload.
- **`TIMBER_REGISTRY`** — the map from type name string → React component. `TimberRenderer` looks up every `node.type` here at render time.
- **Tailwind-only styling** — all static visual styles live in Tailwind utility classes. Never write CSS files for Timber components.

If you have not read the main README yet, do that first.

---

## Component anatomy — the 5 files every component touches

| File | What you do |
|---|---|
| `src/components/<category>/<Name>.tsx` | Write the component and export its props interface |
| `src/components/<category>/index.ts` | Re-export the component and its props type |
| `src/components/index.ts` | Re-export the category barrel |
| `src/types/schema.ts` | Add the new type name to `TimberNodeType` |
| `src/renderer/registry.ts` | Register the component under its type name |
| `src/index.ts` | Export the component and props type from the public API |

Six files, but the last four are one-liners each.

---

## Worked example — creating a `Tag` component

We want a small coloured pill that displays a text label and supports a `color` prop (`'gray' | 'red' | 'green' | 'blue' | 'yellow'`). After this guide, `TimberRenderer` will be able to render:

```json
{
  "type": "Tag",
  "props": { "label": "Beta", "color": "blue" }
}
```

### Step 1 — Write the props interface and component

Create `packages/core/src/components/display/Tag.tsx` (or whichever category folder fits best):

```tsx
import type { CSSProperties } from 'react';

const COLOR_CLASSES: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-700',
  red:    'bg-red-100 text-red-700',
  green:  'bg-green-100 text-green-700',
  blue:   'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export interface TagProps {
  label: string;
  color?: 'gray' | 'red' | 'green' | 'blue' | 'yellow';
  className?: string;
  style?: CSSProperties;
}

export function Tag({ label, color = 'gray', className, style }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        COLOR_CLASSES[color] ?? COLOR_CLASSES['gray'],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {label}
    </span>
  );
}
```

**Key conventions:**

- Export a named `interface` for props. Use `export interface <Name>Props` so consumers can type-check schemas.
- Accept `className` and `style` props. `TimberRenderer` forwards `styling.className` and `styling.style` from the node automatically.
- Use a lookup object (like `COLOR_CLASSES`) for dynamic Tailwind classes — never use template literals like `` `bg-${color}-100` `` because Tailwind's static scanner cannot detect those classes at build time.
- No inline styles for static values. Use Tailwind classes.

---

### Step 2 — Export from the category barrel

If the category barrel (`display/index.ts`) does not exist yet, create it. Otherwise add one line:

```ts
// packages/core/src/components/display/index.ts
export { Tag } from './Tag';
export type { TagProps } from './Tag';
```

---

### Step 3 — Re-export from the components barrel

```ts
// packages/core/src/components/index.ts  (add one line)
export * from './display';
```

---

### Step 4 — Add to `TimberNodeType`

```ts
// packages/core/src/types/schema.ts
export type TimberNodeType =
  // ... existing types ...
  | 'Tag';   // ← add this line
```

This is the string that must appear in the `"type"` field of every JSON node.

---

### Step 5 — Register in `registry.ts`

```ts
// packages/core/src/renderer/registry.ts
import { Tag } from '../components';   // already re-exported

export const TIMBER_REGISTRY: Record<string, ComponentType<any>> = {
  // ... existing entries ...
  Tag,   // ← add this line
};
```

The key must exactly match the string you added to `TimberNodeType`.

---

### Step 6 — Export from the public API barrel

```ts
// packages/core/src/index.ts  (add one line)
export { Tag } from './components';
export type { TagProps } from './components';
```

---

### Step 7 — Use it in a schema

You can now drive this component from a server response:

```json
{
  "version": "1.0",
  "root": {
    "type": "Row",
    "props": { "gap": "gap-2" },
    "children": [
      { "type": "Tag", "props": { "label": "Beta",   "color": "blue" } },
      { "type": "Tag", "props": { "label": "New",    "color": "green" } },
      { "type": "Tag", "props": { "label": "Deprecated", "color": "red" } }
    ]
  }
}
```

Or use it directly in React:

```tsx
import { Tag } from '@timber/core';

<Tag label="Beta" color="blue" />
```

---

## Using HeadlessUI for accessible interactive components

When a component needs keyboard navigation, focus management, or ARIA roles beyond what native HTML provides — dialogs, listboxes, disclosure panels, toggle switches — reach for [HeadlessUI v2](https://headlessui.com).

**When to use HeadlessUI:**

| Pattern | HeadlessUI primitive |
|---|---|
| Modal / dialog | `Dialog` |
| Dropdown / select | `Listbox` |
| Toggle / switch | `Switch` |
| Tabs | `TabGroup` |
| Disclosure / accordion | `Disclosure` |
| Combobox / autocomplete | `Combobox` |

**Example — accessible Toggle using `Switch`:**

```tsx
import { Switch } from '@headlessui/react';

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <Switch.Group>
      <div className="flex items-center gap-3">
        <Switch
          checked={checked}
          onChange={onChange}
          className={[
            'relative inline-flex h-6 w-11 rounded-full transition-colors',
            checked ? 'bg-indigo-600' : 'bg-gray-200',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0.5',
            ].join(' ')}
          />
        </Switch>
        {label && (
          <Switch.Label className="text-sm text-gray-700">{label}</Switch.Label>
        )}
      </div>
    </Switch.Group>
  );
}
```

HeadlessUI handles `aria-checked`, `role="switch"`, keyboard activation, and focus rings. You only control the visual styling.

---

## Styling conventions

### 1. Tailwind-only for static values

```tsx
// ✅ correct
<div className="px-4 py-2 bg-indigo-600 text-white rounded-md" />

// ❌ wrong — inline styles for values expressible as Tailwind classes
<div style={{ padding: '16px 8px', backgroundColor: '#4f46e5' }} />
```

### 2. Dynamic classes must use a lookup object

```tsx
// ✅ correct — Tailwind scanner sees the full class names
const SIZE_CLASSES = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-12 w-12' };
<div className={SIZE_CLASSES[size]} />

// ❌ wrong — Tailwind scanner cannot detect these
<div className={`h-${size === 'sm' ? 6 : 8} w-${size === 'sm' ? 6 : 8}`} />
```

### 3. Dynamic *values* (not class names) use inline `style`

```tsx
// ✅ correct — an arbitrary pixel value from a prop cannot be a Tailwind class
<div style={{ width: props.width, height: props.height }} />
```

### 4. Accept and merge `className` from callers

Every component should accept an optional `className` prop and merge it last so callers can customise without overriding:

```tsx
<div className={['base-classes', className ?? ''].filter(Boolean).join(' ')} />
```

### 5. Accept `style` for runtime overrides

Always accept a `style?: CSSProperties` prop so `TimberRenderer` can forward `styling.style` from the schema node.

---

## Schema design tips

When designing the JSON schema interface for your component, keep these rules in mind.

**Use `props` for component configuration:**

```json
{ "type": "Tag", "props": { "label": "Beta", "color": "blue" } }
```

**Use `data` for server-driven content that changes per request:**

```json
{ "type": "Table", "data": { "rows": [...], "columns": [...] } }
```

**Use `styling` for layout and visual overrides:**

```json
{ "type": "Row", "styling": { "className": "mt-6 px-4" } }
```

**Use `key` for nodes that need runtime `overrides` (event handlers, state):**

Since JSON cannot carry functions, any interactive prop (`onClick`, `isOpen`, `onClose`, `onChange`) must come from the consuming app via the `overrides` prop on `TimberRenderer`:

```json
{ "type": "Button", "key": "submit-btn", "props": { "variant": "primary" }, "children": "Submit" }
```

```tsx
<TimberRenderer
  node={schema.root}
  overrides={{
    'submit-btn': { onClick: () => handleSubmit() },
  }}
/>
```

---

## TypeScript checklist

Before opening a PR, verify:

- [ ] Props interface is exported as `export interface <Name>Props`
- [ ] Component is a named export (not default)
- [ ] Component is typed as `(props: <Name>Props) => JSX.Element`
- [ ] Registry entry uses `ComponentType<any>` — no narrowing needed in the registry map
- [ ] New type name is added to the `TimberNodeType` union in `schema.ts`
- [ ] Component and props type are exported from `src/index.ts`
- [ ] `yarn typecheck` passes with zero errors
- [ ] `yarn build` produces clean output in `dist/`

---

## Adding your component via the `registry` prop (without modifying the library)

If you do not want to fork or publish a modified version of `@timber/core`, you can register custom components at runtime using the `registry` prop on `TimberRenderer`:

```tsx
import { TimberRenderer } from '@timber/core';
import { Tag } from './my-components/Tag';

<TimberRenderer
  node={schema.root}
  registry={{ Tag }}
/>
```

Your component's type string (`"Tag"`) does not need to be in the `TimberNodeType` union when used this way — you just need to make sure the schema your server sends uses the same string. TypeScript will not validate unknown type names from server payloads at runtime anyway.

This approach is ideal for:

- Company-specific branded components
- Domain-specific widgets (charts, maps, video players)
- Rapid prototyping before upstreaming to the library

---

## Questions and contributions

Open an issue or PR in the repository. When adding a component intended for the upstream library, follow the checklist above and include:

1. The component source file
2. A TypeScript props interface
3. An entry in the registry
4. An entry in `TimberNodeType`
5. A usage example added to the demo app
