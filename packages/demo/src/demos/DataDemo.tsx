import { useState } from 'react';
import { Avatar, Divider, Table, Drawer, Column, Row, Card, Text, Button, Badge, Input, Textarea, Select, Toggle, Checkbox } from '@timber/core';
import type { TableColumn } from '@timber/core';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );
}

const USERS = [
  { name: 'Alex Johnson',  email: 'alex@example.com',  role: 'Admin',  status: 'Active',   joined: 'Jan 2024' },
  { name: 'Maria Garcia',  email: 'maria@example.com', role: 'Editor', status: 'Active',   joined: 'Feb 2024' },
  { name: 'James Lee',     email: 'james@example.com', role: 'Viewer', status: 'Inactive', joined: 'Mar 2024' },
  { name: 'Sofia Chen',    email: 'sofia@example.com', role: 'Editor', status: 'Active',   joined: 'Apr 2024' },
  { name: 'Liam Patel',    email: 'liam@example.com',  role: 'Viewer', status: 'Pending',  joined: 'May 2024' },
];

const STATUS_VARIANT: Record<string, 'success' | 'default' | 'warning'> = {
  Active: 'success',
  Inactive: 'default',
  Pending: 'warning',
};

type UserRow = {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
};

const TABLE_COLUMNS: TableColumn<UserRow>[] = [
  {
    key: 'name',
    header: 'User',
    render: (_val, row) => (
      <Row gap="gap-2" align="items-center">
        <Avatar name={row.name} size="sm" />
        <Column gap="gap-0">
          <Text className="text-sm font-medium text-gray-900">{row.name}</Text>
          <Text className="text-xs text-gray-400">{row.email}</Text>
        </Column>
      </Row>
    ),
  },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <Badge
        label={String(val)}
        variant={STATUS_VARIANT[String(val)] ?? 'default'}
        dot
        size="sm"
      />
    ),
  },
  { key: 'joined', header: 'Joined' },
];

export function DataDemo() {
  const [rightDrawer, setRightDrawer] = useState(false);
  const [leftDrawer, setLeftDrawer] = useState(false);
  const [formDrawer, setFormDrawer] = useState(false);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [category, setCategory] = useState('design');

  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <Section title="Avatar">
        <Column gap="gap-6">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">sizes (with initials fallback)</p>
            <Row gap="gap-4" align="items-end">
              <Column gap="gap-1" align="items-center">
                <Avatar name="Alex Johnson" size="xs" />
                <Text className="text-xs text-gray-400">xs</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar name="Maria Garcia" size="sm" />
                <Text className="text-xs text-gray-400">sm</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar name="James Lee" size="md" />
                <Text className="text-xs text-gray-400">md</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar name="Sofia Chen" size="lg" />
                <Text className="text-xs text-gray-400">lg</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar name="Liam Patel" size="xl" />
                <Text className="text-xs text-gray-400">xl</Text>
              </Column>
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">shapes</p>
            <Row gap="gap-4" align="items-center">
              <Column gap="gap-1" align="items-center">
                <Avatar name="Jordan Lee" size="lg" shape="circle" />
                <Text className="text-xs text-gray-400">circle</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar name="Jordan Lee" size="lg" shape="square" />
                <Text className="text-xs text-gray-400">square</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar src="https://picsum.photos/seed/avatar1/100/100" alt="Photo" size="lg" shape="circle" />
                <Text className="text-xs text-gray-400">with src</Text>
              </Column>
              <Column gap="gap-1" align="items-center">
                <Avatar size="lg" />
                <Text className="text-xs text-gray-400">no src/name</Text>
              </Column>
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">avatar group</p>
            <Row className="flex -space-x-2">
              {USERS.slice(0, 5).map((u) => (
                <Avatar key={u.email} name={u.name} size="sm" className="ring-2 ring-white" />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-medium text-gray-600">
                +3
              </div>
            </Row>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Table">
        <Column gap="gap-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">with custom cell renderers + striped</p>
            <Card shadow="md" bordered className="p-0 overflow-hidden">
              <Table
                columns={TABLE_COLUMNS}
                rows={USERS}
                striped
              />
            </Card>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">simple string data + empty state</p>
            <Card shadow="md" bordered className="p-0 overflow-hidden">
              <Table
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'email', header: 'Email' },
                ]}
                rows={[]}
                emptyMessage="No users found. Try adjusting your search."
              />
            </Card>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Drawer">
        <Column gap="gap-4">
          <Row gap="gap-3" wrap>
            <Button variant="primary" onClick={() => setRightDrawer(true)}>
              Open Right Drawer
            </Button>
            <Button variant="secondary" onClick={() => setLeftDrawer(true)}>
              Open Left Drawer
            </Button>
            <Button variant="ghost" onClick={() => setFormDrawer(true)}>
              Open Form Drawer
            </Button>
          </Row>
        </Column>

        {/* Right drawer */}
        <Drawer isOpen={rightDrawer} onClose={() => setRightDrawer(false)} title="Notifications" side="right">
          <Column gap="gap-4">
            {['Your export is ready', 'New team member added', 'Invoice #104 paid'].map((msg, i) => (
              <Row key={i} gap="gap-3" align="items-start">
                <Avatar name={['Alex J', 'Maria G', 'Sofia C'][i]} size="sm" />
                <Column gap="gap-0.5" className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">{msg}</Text>
                  <Text className="text-xs text-gray-400">{['2m ago', '1h ago', 'Yesterday'][i]}</Text>
                </Column>
                <Badge label="New" variant="primary" size="sm" />
              </Row>
            ))}
          </Column>
        </Drawer>

        {/* Left drawer */}
        <Drawer isOpen={leftDrawer} onClose={() => setLeftDrawer(false)} title="Navigation" side="left" size="sm">
          <Column gap="gap-1">
            {['Dashboard', 'Projects', 'Team', 'Settings', 'Billing'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item}
              </button>
            ))}
            <Divider className="my-2" />
            <button className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors">
              Sign out
            </button>
          </Column>
        </Drawer>

        {/* Form drawer */}
        <Drawer isOpen={formDrawer} onClose={() => setFormDrawer(false)} title="Add New Product" side="right" size="md">
          <Column gap="gap-4">
            <Input label="Product name" placeholder="Enter product title…" />
            <Textarea label="Description" placeholder="Describe your product…" rows={4} />
            <Select
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { label: 'Design', value: 'design' },
                { label: 'Development', value: 'dev' },
                { label: 'AI Tools', value: 'ai' },
                { label: 'Productivity', value: 'productivity' },
              ]}
            />
            <Input label="Price ($)" type="number" placeholder="0.00" />
            <Divider />
            <Toggle checked={published} onChange={setPublished} label="Published" description="Make visible on marketplace" />
            <Toggle checked={featured} onChange={setFeatured} label="Featured" description="Appear in featured section" />
            <Checkbox checked={false} onChange={() => {}} label="I confirm this product is original" />
            <Row justify="justify-end" gap="gap-3" className="pt-2">
              <Button variant="ghost" onClick={() => setFormDrawer(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setFormDrawer(false)}>Save Product</Button>
            </Row>
          </Column>
        </Drawer>
      </Section>
    </Column>
  );
}
