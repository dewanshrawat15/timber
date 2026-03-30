import { useState } from 'react';
import { Modal, BottomSheet, Button, Column, Row, Text, Card } from '@timber/core';

export function OverlaysDemo() {
  const [basicModal, setBasicModal] = useState(false);
  const [sizedModal, setSizedModal] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
  const [sheet, setSheet] = useState(false);
  const [tallSheet, setTallSheet] = useState(false);

  return (
    <Column gap="gap-10">
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Modal
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic modal */}
          <Card title="Basic Modal" shadow="md" bordered>
            <Text className="text-sm text-gray-500 mb-4">
              A simple confirmation dialog using HeadlessUI{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">Dialog</code> with fade +
              scale transition.
            </Text>
            <Button variant="primary" onClick={() => setBasicModal(true)}>
              Open Modal
            </Button>
          </Card>

          {/* Size variants */}
          <Card title="Size Variants" shadow="md" bordered>
            <Text className="text-sm text-gray-500 mb-4">
              Modals support <code className="bg-gray-100 px-1 rounded text-xs">sm | md | lg | xl | full</code>.
            </Text>
            <Row gap="gap-2" wrap>
              {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  size="sm"
                  onClick={() => setSizedModal(s)}
                >
                  {s.toUpperCase()}
                </Button>
              ))}
            </Row>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
          BottomSheet
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Card title="Action Sheet" shadow="md" bordered>
            <Text className="text-sm text-gray-500 mb-4">
              Slides up from the bottom with a drag-handle and backdrop dismiss. Great for
              mobile-style action menus.
            </Text>
            <Button variant="primary" onClick={() => setSheet(true)}>
              Open Bottom Sheet
            </Button>
          </Card>

          <Card title="Tall Sheet" shadow="md" bordered>
            <Text className="text-sm text-gray-500 mb-4">
              <code className="bg-gray-100 px-1 rounded text-xs">maxHeight</code> controls the
              sheet height as a Tailwind class.
            </Text>
            <Button variant="secondary" onClick={() => setTallSheet(true)}>
              Open Tall Sheet
            </Button>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Modals */}
      <Modal
        isOpen={basicModal}
        onClose={() => setBasicModal(false)}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        size="md"
      >
        <Row justify="justify-end" gap="gap-3">
          <Button variant="ghost" onClick={() => setBasicModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setBasicModal(false)}>
            Delete
          </Button>
        </Row>
      </Modal>

      <Modal
        isOpen={sizedModal !== null}
        onClose={() => setSizedModal(null)}
        title={`Size: ${sizedModal?.toUpperCase()}`}
        description={`This modal uses size="${sizedModal}". Try the different sizes to compare.`}
        size={sizedModal ?? 'md'}
      >
        <Row justify="justify-end">
          <Button variant="primary" onClick={() => setSizedModal(null)}>
            Close
          </Button>
        </Row>
      </Modal>

      {/* Bottom sheets */}
      <BottomSheet
        isOpen={sheet}
        onClose={() => setSheet(false)}
        title="What would you like to do?"
      >
        <Column gap="gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setSheet(false)}
          >
            Share
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setSheet(false)}
          >
            Download
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={() => setSheet(false)}
          >
            Delete
          </Button>
          <Button variant="ghost" size="lg" className="w-full" onClick={() => setSheet(false)}>
            Cancel
          </Button>
        </Column>
      </BottomSheet>

      <BottomSheet
        isOpen={tallSheet}
        onClose={() => setTallSheet(false)}
        title="Terms and Conditions"
        maxHeight="max-h-[90vh]"
      >
        <Column gap="gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Text key={i} className="text-sm text-gray-600">
              Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          ))}
          <Row justify="justify-end" gap="gap-3" className="pt-4 border-t border-gray-200 mt-2">
            <Button variant="ghost" onClick={() => setTallSheet(false)}>
              Decline
            </Button>
            <Button variant="primary" onClick={() => setTallSheet(false)}>
              Accept
            </Button>
          </Row>
        </Column>
      </BottomSheet>
    </Column>
  );
}
