import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Input, Textarea, Select, Checkbox, Toggle, Button, Column, Row, Card, Text, Alert, Divider } from '@timber/core';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );
}

export function FormsDemo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [plan, setPlan] = useState('pro');
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const planOptions = [
    { label: 'Free — $0/mo', value: 'free' },
    { label: 'Pro — $12/mo', value: 'pro' },
    { label: 'Team — $49/mo', value: 'team' },
    { label: 'Enterprise — Contact us', value: 'enterprise' },
  ];

  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <Section title="Input">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Text" placeholder="Enter text…" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" hint="Minimum 8 characters" />
          <Input label="Number" type="number" placeholder="42" />
          <Input label="With error" placeholder="Bad value" defaultValue="invalid@" error="Please enter a valid email address." />
          <Input label="Disabled" placeholder="Not editable" disabled defaultValue="Read-only value" />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-mono text-gray-400">sizes</p>
          <Column gap="gap-3">
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input (default)" />
            <Input size="lg" placeholder="Large input" />
          </Column>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Textarea">
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="Bio" placeholder="Tell us about yourself…" rows={4} />
          <Textarea label="With error" defaultValue="Too short" error="Must be at least 20 characters." rows={4} />
          <Textarea label="Disabled" disabled defaultValue="This field is read-only." rows={3} />
          <Textarea label="With hint" placeholder="Optional notes…" hint="Supports plain text only." rows={3} />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Select">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Plan"
            value={plan}
            onChange={setPlan}
            options={planOptions}
          />
          <Select
            label="With error"
            value=""
            onChange={() => {}}
            options={planOptions}
            placeholder="Choose a plan"
            error="You must select a plan."
          />
          <Select
            label="Disabled"
            value="pro"
            onChange={() => {}}
            options={planOptions}
            disabled
          />
          <Select
            label="Country"
            value=""
            onChange={() => {}}
            placeholder="Select country…"
            options={[
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Canada', value: 'ca' },
              { label: 'Australia', value: 'au' },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Checkbox">
        <Column gap="gap-4">
          <Checkbox
            checked={newsletter}
            onChange={setNewsletter}
            label="Subscribe to newsletter"
            description="Weekly product updates and tips."
          />
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label="I agree to the Terms of Service"
            description="You must accept to continue."
          />
          <Checkbox
            checked
            onChange={() => {}}
            label="Disabled (checked)"
            disabled
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="Disabled (unchecked)"
            disabled
          />
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Toggle">
        <Column gap="gap-4">
          <Toggle
            checked={notifications}
            onChange={setNotifications}
            label="Email notifications"
            description="Receive updates and alerts via email."
          />
          <Divider />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Dark mode"
            description="Switch to a dark colour scheme."
            size="sm"
          />
          <Divider />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Disabled toggle"
            size="lg"
            disabled
          />
        </Column>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Complete form">
        <Card shadow="md" bordered>
          {submitted ? (
            <Alert
              variant="success"
              title="Account created!"
              description="Welcome aboard. Check your email for confirmation."
            />
          ) : (
            <Column gap="gap-4">
              <Text as="h3" className="text-lg font-semibold text-gray-900">Create account</Text>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                hint="Minimum 8 characters"
              />
              <Textarea
                label="Bio (optional)"
                value={bio}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                placeholder="A few words about you…"
                rows={3}
              />
              <Select label="Plan" value={plan} onChange={setPlan} options={planOptions} />
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                label="Email notifications"
              />
              <Checkbox
                checked={agreed}
                onChange={setAgreed}
                label="I agree to the Terms of Service"
              />
              <Row justify="justify-end" gap="gap-3">
                <Button variant="ghost" onClick={() => { setEmail(''); setPassword(''); setBio(''); }}>
                  Reset
                </Button>
                <Button
                  variant="primary"
                  disabled={!agreed || !email || !password}
                  onClick={() => setSubmitted(true)}
                >
                  Create Account
                </Button>
              </Row>
            </Column>
          )}
        </Card>
      </Section>
    </Column>
  );
}
