import { Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Tailwind max-h-* class, defaults to "max-h-[80vh]" */
  maxHeight?: string;
  children?: ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  maxHeight = 'max-h-[80vh]',
  children,
  className,
}: BottomSheetProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-up panel */}
        <div className="fixed inset-x-0 bottom-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel
              className={[
                'w-full overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6',
                maxHeight,
                className ?? '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
              {title && (
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {title}
                </Dialog.Title>
              )}
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
