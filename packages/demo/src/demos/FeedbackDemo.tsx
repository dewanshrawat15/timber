import { useState } from 'react';
import { Badge, Alert, Spinner, Skeleton, Progress, Column, Row, Card, Text, Button, Divider } from '@timber/core';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );
}

export function FeedbackDemo() {
  const [progress, setProgress] = useState(65);
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <Section title="Badge">
        <Column gap="gap-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">variant</p>
            <Row gap="gap-2" wrap>
              <Badge label="Default" variant="default" />
              <Badge label="Primary" variant="primary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Error" variant="error" />
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">size</p>
            <Row gap="gap-2" align="items-center">
              <Badge label="Small" variant="primary" size="sm" />
              <Badge label="Medium" variant="primary" size="md" />
              <Badge label="Large" variant="primary" size="lg" />
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">with dot</p>
            <Row gap="gap-2" wrap>
              <Badge label="Online" variant="success" dot />
              <Badge label="Busy" variant="warning" dot />
              <Badge label="Offline" variant="default" dot />
              <Badge label="Error" variant="error" dot />
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">in context</p>
            <Row gap="gap-3" align="items-center" wrap>
              <Text className="text-sm font-medium text-gray-900">Order status</Text>
              <Badge label="Shipped" variant="primary" dot />
              <Badge label="2 new" variant="error" size="sm" />
            </Row>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Alert">
        <Column gap="gap-3">
          <Alert variant="info" title="Update available" description="Version 2.1.0 is ready to install." />
          <Alert variant="success" title="Changes saved" description="Your profile has been updated successfully." />
          <Alert variant="warning" title="Storage almost full" description="You've used 90% of your storage quota." />
          <Alert variant="error" title="Payment failed" description="Your card ending in 4242 was declined." />
          <Alert
            variant="info"
            title="Dismissible alert"
            description="Click the × to dismiss this alert."
            dismissible
          />
          <Alert variant="success" description="A minimal alert with no title." />
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Spinner">
        <Column gap="gap-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">size</p>
            <Row gap="gap-6" align="items-center">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">color</p>
            <Row gap="gap-6" align="items-center">
              <Spinner color="indigo" />
              <Spinner color="green" />
              <Spinner color="red" />
              <Spinner color="gray" />
              <div className="bg-indigo-600 p-3 rounded-lg">
                <Spinner color="white" />
              </div>
            </Row>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">in a button</p>
            <Button variant="primary" disabled>
              <Row gap="gap-2" align="items-center">
                <Spinner size="sm" color="white" />
                <span>Saving…</span>
              </Row>
            </Button>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Skeleton">
        <Column gap="gap-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">single line</p>
            <Column gap="gap-2">
              <Skeleton height="1rem" rounded="md" />
              <Skeleton height="1rem" width="75%" rounded="md" />
              <Skeleton height="1rem" width="50%" rounded="md" />
            </Column>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">multi-line (lines prop)</p>
            <Skeleton lines={4} />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">card placeholder</p>
            <Card shadow="md" bordered>
              <Row gap="gap-4" align="items-start">
                <Skeleton width="3rem" height="3rem" rounded="full" />
                <Column gap="gap-2" className="flex-1">
                  <Skeleton height="1rem" width="60%" />
                  <Skeleton height="0.75rem" width="40%" />
                </Column>
              </Row>
              <Skeleton height="8rem" rounded="md" className="mt-4" />
              <Skeleton lines={3} className="mt-3" />
            </Card>
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 mb-2">toggle loaded state</p>
            <Row gap="gap-3" align="items-center">
              <Button size="sm" variant="secondary" onClick={() => setSkeletonVisible((v) => !v)}>
                {skeletonVisible ? 'Load content' : 'Show skeleton'}
              </Button>
            </Row>
            <div className="mt-3">
              {skeletonVisible ? (
                <Skeleton lines={3} />
              ) : (
                <Column gap="gap-1">
                  <Text className="text-sm font-semibold text-gray-900">Content loaded!</Text>
                  <Text className="text-sm text-gray-600">This is the real content that replaced the skeleton placeholder.</Text>
                </Column>
              )}
            </div>
          </div>
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Progress">
        <Column gap="gap-6">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">color variants</p>
            <Column gap="gap-4">
              <Progress value={72} color="indigo" label="Upload" showLabel />
              <Progress value={45} color="green" label="Storage" showLabel />
              <Progress value={88} color="yellow" label="CPU" showLabel />
              <Progress value={30} color="red" label="Memory" showLabel />
            </Column>
          </div>

          <Divider />

          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">size variants</p>
            <Column gap="gap-4">
              <Progress value={60} size="sm" color="indigo" label="Small" showLabel />
              <Progress value={60} size="md" color="indigo" label="Medium" showLabel />
              <Progress value={60} size="lg" color="indigo" label="Large" showLabel />
            </Column>
          </div>

          <Divider />

          <div>
            <p className="text-xs font-mono text-gray-400 mb-3">interactive</p>
            <Column gap="gap-3">
              <Progress value={progress} color="indigo" label="Adjustable" showLabel />
              <Row gap="gap-2">
                <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
                  −10
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
                  +10
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setProgress(0)}>
                  Reset
                </Button>
              </Row>
            </Column>
          </div>
        </Column>
      </Section>
    </Column>
  );
}
