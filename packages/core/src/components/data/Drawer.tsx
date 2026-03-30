import { Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export type DrawerSide = 'left' | 'right';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: DrawerSide;
  size?: DrawerSize;
  children?: ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const SLIDE_FROM: Record<DrawerSide, { enter: string; from: string; to: string; leave: string; leaveFrom: string; leaveTo: string }> = {
  right: {
    enter: 'ease-out duration-300',
    from: 'translate-x-full',
    to: 'translate-x-0',
    leave: 'ease-in duration-200',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  left: {
    enter: 'ease-out duration-300',
    from: '-translate-x-full',
    to: 'translate-x-0',
    leave: 'ease-in duration-200',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full',
  },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  size = 'md',
  children,
  className,
}: DrawerProps) {
  const slide = SLIDE_FROM[side];

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

        <div className={['fixed inset-y-0', side === 'right' ? 'right-0' : 'left-0', 'flex'].join(' ')}>
          <Transition.Child
            as={Fragment}
            enter={slide.enter}
            enterFrom={slide.from}
            enterTo={slide.to}
            leave={slide.leave}
            leaveFrom={slide.leaveFrom}
            leaveTo={slide.leaveTo}
          >
            <Dialog.Panel
              className={[
                'relative flex flex-col w-screen bg-white shadow-2xl',
                SIZE_CLASSES[size],
                className ?? '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {title}
                  </Dialog.Title>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto -mr-1 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close drawer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
