import { TimberRenderer, Column, Text, Card } from '@timber/core';
import type { TimberSchema, TimberNode } from '@timber/core';
import type { ComponentType } from 'react';

// ---------------------------------------------------------------------------
// 1. Custom component not in the default registry
// ---------------------------------------------------------------------------
interface BadgeProps {
  label: string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  className?: string;
}

function Badge({ label, color = 'blue', className }: BadgeProps) {
  const COLOR: Record<NonNullable<BadgeProps['color']>, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        COLOR[color],
        className ?? '',
      ].join(' ')}
    >
      {label}
    </span>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'flat';
  className?: string;
}

function StatCard({ value, label, trend = 'flat', className }: StatCardProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor =
    trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  return (
    <div
      className={[
        'rounded-xl bg-white border border-gray-200 shadow-sm p-4',
        className ?? '',
      ].join(' ')}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={['text-sm font-medium mb-0.5', trendColor].join(' ')}>{trendIcon}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Extended registry — adds Badge and StatCard
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXTENDED_REGISTRY: Record<string, ComponentType<any>> = {
  Badge,
  StatCard,
};

// ---------------------------------------------------------------------------
// 3. Schemas using custom types
// ---------------------------------------------------------------------------
const BADGE_SCHEMA: TimberSchema = {
  version: '1.0',
  name: 'Badge Demo',
  root: {
    type: 'Row',
    key: 'badge-row',
    styling: { className: 'gap-2 flex-wrap p-4' },
    children: [
      { type: 'Badge' as TimberNode['type'], key: 'b1', props: { label: 'New', color: 'blue' } },
      { type: 'Badge' as TimberNode['type'], key: 'b2', props: { label: 'Success', color: 'green' } },
      { type: 'Badge' as TimberNode['type'], key: 'b3', props: { label: 'Error', color: 'red' } },
      { type: 'Badge' as TimberNode['type'], key: 'b4', props: { label: 'Warning', color: 'yellow' } },
    ],
  },
};

const STAT_SCHEMA: TimberSchema = {
  version: '1.0',
  name: 'Stat Cards',
  root: {
    type: 'Grid',
    key: 'stats',
    props: { cols: 3, gap: 'gap-4' },
    styling: { className: 'p-4' },
    children: [
      {
        type: 'StatCard' as TimberNode['type'],
        key: 's1',
        props: { value: '$48,200', label: 'Monthly Revenue', trend: 'up' },
      },
      {
        type: 'StatCard' as TimberNode['type'],
        key: 's2',
        props: { value: '2,841', label: 'Active Users', trend: 'up' },
      },
      {
        type: 'StatCard' as TimberNode['type'],
        key: 's3',
        props: { value: '98.2%', label: 'Uptime', trend: 'flat' },
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 4. Schema with unknown type — demonstrates the Error
// ---------------------------------------------------------------------------
const INVALID_SCHEMA: TimberSchema = {
  version: '1.0',
  name: 'Error Demo',
  root: {
    type: 'UnknownWidget' as TimberNode['type'],
    key: 'unknown',
  },
};

function ErrorBoundaryInline({
  schema,
  registry,
}: {
  schema: TimberSchema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registry?: Record<string, ComponentType<any>>;
}) {
  try {
    return <TimberRenderer node={schema.root} registry={registry} />;
  } catch (e) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-mono whitespace-pre-wrap">
        {e instanceof Error ? e.message : String(e)}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card title={title} shadow="md" bordered>
      <Text className="text-sm text-gray-500 mb-4">{description}</Text>
      {children}
    </Card>
  );
}

export function CustomRendererDemo() {
  return (
    <Column gap="gap-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <Text as="h2" className="text-base font-semibold text-indigo-900 mb-1">
          Extending TimberRenderer
        </Text>
        <Text className="text-sm text-indigo-700">
          Pass a <code className="bg-indigo-100 px-1 rounded text-xs">registry</code> prop to
          inject custom components. They are merged with the default registry and available in any
          schema. Unknown types not in the merged registry throw a descriptive{' '}
          <code className="bg-indigo-100 px-1 rounded text-xs">Error</code>.
        </Text>
      </div>

      <Section
        title="Custom Badge component"
        description="Badge is not in the default registry — it's passed via the registry prop. The schema uses type: 'Badge'."
      >
        <ErrorBoundaryInline schema={BADGE_SCHEMA} registry={EXTENDED_REGISTRY} />
      </Section>

      <Section
        title="Custom StatCard component"
        description="StatCard renders a metric widget with an up/down/flat trend indicator. Schema uses a 3-col Grid of StatCard nodes."
      >
        <ErrorBoundaryInline schema={STAT_SCHEMA} registry={EXTENDED_REGISTRY} />
      </Section>

      <Section
        title="Unknown type → descriptive Error"
        description="Rendering a schema with type: 'UnknownWidget' (not in the default or extended registry) throws an Error listing all valid types."
      >
        <Column gap="gap-3">
          <Text className="text-xs font-mono text-gray-500">
            {'{ type: "UnknownWidget" }  ←  not registered'}
          </Text>
          <ErrorBoundaryInline schema={INVALID_SCHEMA} />
        </Column>
      </Section>

      <Section
        title="Code snippet"
        description="How to register custom components and use them in a schema."
      >
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-auto">
{`import { TimberRenderer } from '@timber/core';

// 1. Define your custom component
function Badge({ label, color = 'blue' }) {
  return <span className={\`badge badge-\${color}\`}>{label}</span>;
}

// 2. Build the schema (e.g. returned by your server)
const schema = {
  version: '1.0',
  root: {
    type: 'Badge',          // custom type
    props: { label: 'New', color: 'green' },
  },
};

// 3. Pass registry + schema to TimberRenderer
<TimberRenderer
  node={schema.root}
  registry={{ Badge }}      // merged with built-in registry
/>`}
        </pre>
      </Section>
    </Column>
  );
}
