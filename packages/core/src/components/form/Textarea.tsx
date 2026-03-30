import type { CSSProperties, TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  style?: CSSProperties;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  rows = 4,
  disabled,
  className,
  style,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const textareaClasses = [
    'block w-full rounded-md border bg-white shadow-sm transition-colors resize-y',
    'px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
      : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-300',
    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        style={style}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
