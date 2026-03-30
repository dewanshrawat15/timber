import { Row, Column, Grid, Text, Button, Image, Card } from '@timber/core';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function DemoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-gray-400">{label}</p>
      <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50">
        {children}
      </div>
    </div>
  );
}

export function ComponentsDemo() {
  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <Section title="Text">
        <Column gap="gap-2">
          {(['h1', 'h2', 'h3', 'h4', 'p', 'span', 'label'] as const).map((tag) => (
            <DemoBox key={tag} label={`<Text as="${tag}" />`}>
              <Text
                as={tag}
                className={
                  tag === 'h1'
                    ? 'text-3xl font-bold'
                    : tag === 'h2'
                    ? 'text-2xl font-semibold'
                    : tag === 'h3'
                    ? 'text-xl font-semibold'
                    : tag === 'h4'
                    ? 'text-lg font-medium'
                    : 'text-sm text-gray-700'
                }
              >
                The quick brown fox — {tag}
              </Text>
            </DemoBox>
          ))}
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Button">
        <Column gap="gap-4">
          <DemoBox label="variant">
            <Row gap="gap-3" wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </Row>
          </DemoBox>
          <DemoBox label="size">
            <Row gap="gap-3" align="items-center" wrap>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
          </DemoBox>
          <DemoBox label="disabled">
            <Row gap="gap-3" wrap>
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </Row>
          </DemoBox>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Image">
        <Grid cols={3} gap="gap-4">
          {(['cover', 'contain', 'none'] as const).map((fit) => (
            <DemoBox key={fit} label={`objectFit="${fit}"`}>
              <Image
                src={`https://picsum.photos/seed/${fit}/400/300`}
                alt={`objectFit ${fit}`}
                objectFit={fit}
                className="w-full h-32 rounded-lg bg-gray-200"
              />
            </DemoBox>
          ))}
        </Grid>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Card">
        <Grid cols={2} gap="gap-4">
          <DemoBox label="basic">
            <Card title="Card Title" subtitle="Subtitle text" shadow="md">
              <Text className="text-sm text-gray-600">
                Card body content goes here. Cards support title, subtitle, shadow, border, and
                footer.
              </Text>
            </Card>
          </DemoBox>

          <DemoBox label="bordered + footer">
            <Card
              title="Bordered Card"
              bordered
              shadow="lg"
              footer={
                <Row justify="justify-end" gap="gap-2">
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Save
                  </Button>
                </Row>
              }
            >
              <Text className="text-sm text-gray-600">With a footer row and border.</Text>
            </Card>
          </DemoBox>

          <DemoBox label="no shadow">
            <Card title="Flat Card" shadow="none" bordered>
              <Text className="text-sm text-gray-600">shadow="none" bordered</Text>
            </Card>
          </DemoBox>

          <DemoBox label="with image">
            <Card shadow="md" className="p-0 overflow-hidden">
              <Image
                src="https://picsum.photos/seed/card/600/200"
                alt="card hero"
                objectFit="cover"
                className="w-full h-32"
              />
              <div className="p-4">
                <Text as="h4" className="font-semibold text-gray-900">
                  Card with hero image
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Compose components freely inside cards.
                </Text>
              </div>
            </Card>
          </DemoBox>
        </Grid>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Layout — Row">
        <Column gap="gap-4">
          <DemoBox label='gap="gap-4" (default)'>
            <Row gap="gap-4">
              {['A', 'B', 'C'].map((l) => (
                <div key={l} className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-700 font-bold">
                  {l}
                </div>
              ))}
            </Row>
          </DemoBox>
          <DemoBox label='justify="justify-between"'>
            <Row justify="justify-between" className="w-full">
              {['Left', 'Center', 'Right'].map((l) => (
                <div key={l} className="px-3 py-1.5 bg-purple-100 rounded text-purple-700 text-sm font-medium">
                  {l}
                </div>
              ))}
            </Row>
          </DemoBox>
          <DemoBox label='wrap={true}'>
            <Row gap="gap-2" wrap>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="px-3 py-1 bg-green-100 rounded text-green-700 text-sm">
                  Item {i + 1}
                </div>
              ))}
            </Row>
          </DemoBox>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Layout — Column">
        <DemoBox label='gap="gap-3"'>
          <Column gap="gap-3">
            {['First', 'Second', 'Third'].map((l) => (
              <div key={l} className="px-4 py-2 bg-orange-100 rounded text-orange-700 text-sm font-medium">
                {l}
              </div>
            ))}
          </Column>
        </DemoBox>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Layout — Grid">
        <Column gap="gap-4">
          {([2, 3, 4] as const).map((cols) => (
            <DemoBox key={cols} label={`cols={${cols}}`}>
              <Grid cols={cols} gap="gap-2">
                {Array.from({ length: cols * 2 }, (_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-teal-100 rounded flex items-center justify-center text-teal-700 text-sm"
                  >
                    {i + 1}
                  </div>
                ))}
              </Grid>
            </DemoBox>
          ))}
        </Column>
      </Section>
    </Column>
  );
}
