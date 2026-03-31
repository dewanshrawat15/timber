import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { CSSProperties } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Select({
  options,
  value,
  onChange,
  label,
  error,
  hint,
  placeholder = 'Select an option',
  disabled,
  className,
  style,
}: SelectProps) {
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <div className={['w-full', className ?? ''].filter(Boolean).join(' ')} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={[
              'relative w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-left shadow-sm',
              'dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-600 dark:focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-600',
              disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={selected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
              {selected ? selected.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    [
                      'relative cursor-pointer select-none px-3 py-2',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100',
                    ].join(' ')
                  }
                >
                  {({ selected: isSelected }) => (
                    <span className={isSelected ? 'font-medium' : 'font-normal'}>
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}
