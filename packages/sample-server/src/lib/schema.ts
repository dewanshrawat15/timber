/**
 * Lightweight helpers for building TimberNode trees server-side.
 * These mirror the types in @timber/core without importing the package.
 */

export interface TimberStyle {
  className?: string;
  style?: Record<string, unknown>;
}

export interface TimberNode {
  type: string;
  key?: string;
  props?: Record<string, unknown>;
  styling?: TimberStyle;
  data?: Record<string, unknown>;
  children?: TimberNode[] | string;
}

export interface TimberSchema {
  version: string;
  name?: string;
  root: TimberNode;
}

// Convenience builder so schema code stays concise
export function node(
  type: string,
  opts: Omit<TimberNode, 'type'> = {},
): TimberNode {
  return { type, ...opts };
}

export function col(opts: Omit<TimberNode, 'type'>): TimberNode {
  return node('Column', opts);
}

export function row(opts: Omit<TimberNode, 'type'>): TimberNode {
  return node('Row', opts);
}

export function text(
  content: string,
  opts: Omit<TimberNode, 'type' | 'children'> = {},
): TimberNode {
  return node('Text', { ...opts, children: content });
}

export function btn(
  label: string,
  key: string,
  variant: string = 'primary',
  size: string = 'md',
  extra: Partial<TimberNode> = {},
): TimberNode {
  return node('Button', {
    key,
    props: { variant, size },
    children: label,
    ...extra,
  });
}

export function schema(name: string, root: TimberNode): TimberSchema {
  return { version: '1.0', name, root };
}
