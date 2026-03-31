import type { CSSProperties, InputHTMLAttributes } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  className?: string;
  style?: CSSProperties;
}

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

export function Input({
  label,
  error,
  hint,
  size = 'md',
  id,
  className,
  style,
  disabled,
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const inputClasses = [
    'block w-full rounded-md border bg-white shadow-sm transition-colors',
    'text-gray-900 placeholder-gray-400',
    'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-600 dark:focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-300 dark:focus:border-indigo-500 dark:focus:ring-indigo-600',
    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : '',
    SIZE_CLASSES[size],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        disabled={disabled}
        className={inputClasses}
        style={style}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}
