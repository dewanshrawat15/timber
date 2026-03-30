import { Switch } from '@headlessui/react';
import type { CSSProperties } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: ToggleSize;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const TRACK_SIZE: Record<ToggleSize, string> = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
};

const THUMB_SIZE: Record<ToggleSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const THUMB_TRANSLATE: Record<ToggleSize, string> = {
  sm: 'translate-x-3',
  md: 'translate-x-4',
  lg: 'translate-x-5',
};

export function Toggle({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled,
  className,
  style,
}: ToggleProps) {
  return (
    <Switch.Group
      as="div"
      className={['flex items-center justify-between gap-4', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <Switch.Label
              as="span"
              className={[
                'text-sm font-medium text-gray-900',
                disabled ? 'opacity-50' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </Switch.Label>
          )}
          {description && (
            <Switch.Description as="span" className="text-xs text-gray-500">
              {description}
            </Switch.Description>
          )}
        </span>
      )}

      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={[
          'relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          TRACK_SIZE[size],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block rounded-full bg-white shadow ring-0',
            'transition duration-200 ease-in-out',
            checked ? THUMB_TRANSLATE[size] : 'translate-x-0',
            THUMB_SIZE[size],
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </Switch>
    </Switch.Group>
  );
}
