import { useState } from 'react';
import { Tabs, Breadcrumb, Navbar, Column, Row, Card, Text, Button, Avatar, Input, Badge, Divider } from '@timber/core';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );
}

const PRODUCT_TABS = [
  { key: 'description', label: 'Description' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'changelog', label: 'Changelog' },
  { key: 'support', label: 'Support', disabled: true },
];

const SETTINGS_TABS = [
  { key: 'general', label: 'General' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
  { key: 'team', label: 'Team' },
];

export function NavigationDemo() {
  const [underlineTab, setUnderlineTab] = useState('description');
  const [pillsTab, setPillsTab] = useState('general');

  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <Section title="Tabs — underline variant">
        <Column gap="gap-4">
          <Card shadow="md" bordered>
            <Tabs
              tabs={PRODUCT_TABS}
              activeTab={underlineTab}
              onChange={setUnderlineTab}
              variant="underline"
            />
            <div className="pt-4 text-sm text-gray-600">
              {underlineTab === 'description' && (
                <Text className="text-sm text-gray-600">
                  A powerful design tool for teams. Streamline your workflow with real-time collaboration, asset libraries, and one-click handoff.
                </Text>
              )}
              {underlineTab === 'reviews' && (
                <Column gap="gap-3">
                  {['Sarah K.', 'Tom H.', 'Priya M.'].map((name) => (
                    <Row key={name} gap="gap-3" align="items-start">
                      <Avatar name={name} size="sm" />
                      <Column gap="gap-0.5" className="flex-1">
                        <Row gap="gap-2" align="items-center">
                          <Text className="text-sm font-medium text-gray-900">{name}</Text>
                          <Text className="text-xs text-yellow-500">★★★★★</Text>
                        </Row>
                        <Text className="text-xs text-gray-500">Excellent tool, highly recommended!</Text>
                      </Column>
                    </Row>
                  ))}
                </Column>
              )}
              {underlineTab === 'changelog' && (
                <Column gap="gap-3">
                  {[
                    { v: 'v2.1.0', note: 'Added dark mode support and keyboard navigation.' },
                    { v: 'v2.0.0', note: 'Full TypeScript rewrite with improved performance.' },
                    { v: 'v1.9.2', note: 'Bug fixes and stability improvements.' },
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
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Tabs — pills variant">
        <Card shadow="md" bordered>
          <Tabs
            tabs={SETTINGS_TABS}
            activeTab={pillsTab}
            onChange={setPillsTab}
            variant="pills"
          />
          <div className="pt-4 text-sm text-gray-600">
            Active tab: <span className="font-medium text-indigo-600">{pillsTab}</span>
          </div>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Breadcrumb">
        <Column gap="gap-3">
          <Card shadow="sm" bordered className="p-3">
            <Breadcrumb items={[{ label: 'Home', href: '#' }]} />
          </Card>
          <Card shadow="sm" bordered className="p-3">
            <Breadcrumb
              items={[
                { label: 'Home', href: '#' },
                { label: 'Marketplace', href: '#' },
                { label: 'Design Tools' },
              ]}
            />
          </Card>
          <Card shadow="sm" bordered className="p-3">
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '#' },
                { label: 'Settings', href: '#' },
                { label: 'Billing', href: '#' },
                { label: 'Invoices' },
              ]}
              separator="›"
            />
          </Card>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Navbar">
        <Column gap="gap-6">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">full navbar</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <Navbar
                brand={
                  <Row gap="gap-2" align="items-center">
                    <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">T</span>
                    </div>
                    <span className="font-bold text-gray-900">Timber</span>
                  </Row>
                }
                links={[
                  { label: 'Home', href: '#', active: true },
                  { label: 'Marketplace', href: '#' },
                  { label: 'Docs', href: '#' },
                  { label: 'Pricing', href: '#' },
                ]}
                actions={
                  <Row gap="gap-2" align="items-center">
                    <Button variant="ghost" size="sm">Log in</Button>
                    <Button variant="primary" size="sm">Sign up</Button>
                  </Row>
                }
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">navbar with avatar + search</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <Navbar
                brand={<span className="font-bold text-gray-900">Acme Corp</span>}
                links={[
                  { label: 'Dashboard', href: '#', active: true },
                  { label: 'Projects', href: '#' },
                  { label: 'Team', href: '#' },
                ]}
                actions={
                  <Row gap="gap-3" align="items-center">
                    <Input size="sm" placeholder="Search…" className="w-40" />
                    <Badge label="3" variant="error" size="sm" />
                    <Avatar name="Jordan Lee" size="sm" />
                  </Row>
                }
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">brand-only navbar</p>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <Navbar
                brand={<span className="text-lg font-bold text-indigo-600">Logo</span>}
                actions={
                  <Button variant="primary" size="sm">Get started</Button>
                }
              />
            </div>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Divider">
        <Column gap="gap-6">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">horizontal</p>
            <Column gap="gap-3">
              <Divider />
              <Divider label="or continue with" />
              <Divider label="Section break" />
            </Column>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">vertical (in a Row)</p>
            <Row gap="gap-4" align="items-center" className="h-8">
              <Text className="text-sm text-gray-600">Home</Text>
              <Divider orientation="vertical" />
              <Text className="text-sm text-gray-600">About</Text>
              <Divider orientation="vertical" />
              <Text className="text-sm text-gray-600">Contact</Text>
            </Row>
          </div>
        </Column>
      </Section>
    </Column>
  );
}
