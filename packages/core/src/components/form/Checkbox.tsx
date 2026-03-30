import type { CSSProperties } from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
  className,
  style,
}: CheckboxProps) {
  const checkboxId = id ?? (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div
      className={['flex items-start gap-3', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="flex h-5 items-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={[
            'h-4 w-4 rounded border-gray-300 text-indigo-600',
            'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {(label || description) && (
        <div className="text-sm">
          {label && (
            <label
              htmlFor={checkboxId}
              className={[
                'font-medium text-gray-900',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </label>
          )}
          {description && <p className="text-gray-500 mt-0.5">{description}</p>}
        </div>
      )}
    </div>
  );
}
