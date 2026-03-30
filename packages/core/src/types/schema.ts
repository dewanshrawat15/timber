import type { CSSProperties } from 'react';

export interface TimberStyle {
  /** One or more Tailwind utility classes (space-separated) */
  className?: string;
  /** Inline React styles — for dynamic values that cannot be expressed as static Tailwind classes */
  style?: CSSProperties;
}

export type TimberNodeType =
  // Layout
  | 'Row'
  | 'Column'
  | 'Grid'
  // Display
  | 'Image'
  | 'Card'
  | 'Text'
  | 'Button'
  // Overlay
  | 'Modal'
  | 'BottomSheet'
  // Form
  | 'Input'
  | 'Textarea'
  | 'Select'
  | 'Checkbox'
  | 'Toggle'
  // Feedback
  | 'Badge'
  | 'Alert'
  | 'Spinner'
  | 'Skeleton'
  | 'Progress'
  // Navigation
  | 'Tabs'
  | 'Breadcrumb'
  | 'Navbar'
  // Data
  | 'Avatar'
  | 'Divider'
  | 'Table'
  | 'Drawer';

export interface TimberNode {
  /** Which registered component to render */
  type: TimberNodeType;
  /** Component-specific props */
  props?: Record<string, unknown>;
  /** Tailwind className and/or inline style */
  styling?: TimberStyle;
  /** Nested child nodes, or a plain string for leaf text nodes */
  children?: TimberNode[] | string;
  /** Arbitrary server-driven data payload */
  data?: Record<string, unknown>;
  /** Optional stable key — used as React key when rendering lists */
  key?: string;
}

export interface TimberSchema {
  /** Schema format version */
  version: string;
  /** Human-readable name for this layout/screen */
  name?: string;
  /** The root node of the component tree */
  root: TimberNode;
}
