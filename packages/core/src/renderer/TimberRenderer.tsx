import React, { type ComponentType } from 'react';
import type { TimberNode } from '../types/schema';
import { TIMBER_REGISTRY } from './registry';

export interface TimberRendererProps {
  node: TimberNode;
  /**
   * Inject event handlers or runtime state keyed by node.key.
   * Because schemas are JSON, functions cannot be serialized — use overrides
   * to attach onClick, onClose, isOpen, etc. from the consuming React app.
   *
   * @example
   * overrides={{
   *   'open-btn': { onClick: () => setOpen(true) },
   *   'demo-modal': { isOpen, onClose: () => setOpen(false) },
   * }}
   */
  overrides?: Record<string, Record<string, unknown>>;
  /**
   * Extend or override the default component registry.
   * Pass custom components here to support types beyond the built-in set.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registry?: Partial<Record<string, ComponentType<any>>>;
}

export function TimberRenderer({
  node,
  overrides,
  registry,
}: TimberRendererProps): React.ReactElement {
  const mergedRegistry = registry
    ? { ...TIMBER_REGISTRY, ...registry }
    : TIMBER_REGISTRY;

  const Component = mergedRegistry[node.type];

  if (!Component) {
    throw new Error(
      `[TimberRenderer] Unknown component type: "${node.type}". ` +
        `Built-in types are: ${Object.keys(TIMBER_REGISTRY).join(', ')}. ` +
        `To add custom types, pass a "registry" prop with your component map.`
    );
  }

  // Merge props, data, and styling — styling spreads as className/style
  const resolvedProps: Record<string, unknown> = {
    ...node.props,
    ...node.data,
    ...(node.styling?.className ? { className: node.styling.className } : {}),
    ...(node.styling?.style ? { style: node.styling.style } : {}),
    // Consumer overrides (event handlers, runtime state) keyed by node.key
    ...(node.key && overrides?.[node.key] ? overrides[node.key] : {}),
  };

  // Resolve children
  let resolvedChildren: React.ReactNode;
  if (typeof node.children === 'string') {
    resolvedChildren = node.children;
  } else if (Array.isArray(node.children)) {
    resolvedChildren = node.children.map((child, index) => (
      <TimberRenderer
        key={child.key ?? index}
        node={child}
        overrides={overrides}
        registry={registry}
      />
    ));
  }

  return <Component {...resolvedProps}>{resolvedChildren}</Component>;
}
