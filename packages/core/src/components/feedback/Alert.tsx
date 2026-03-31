import { useState, type CSSProperties, type ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const VARIANT_CLASSES: Record<AlertVariant, { wrapper: string; icon: string; title: string; body: string }> = {
  info: {
    wrapper: 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
    icon: 'text-blue-500 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    body: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    wrapper: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
    icon: 'text-green-500 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    body: 'text-green-700 dark:text-green-300',
  },
  warning: {
    wrapper: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800',
    icon: 'text-yellow-500 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    body: 'text-yellow-700 dark:text-yellow-300',
  },
  error: {
    wrapper: 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
    icon: 'text-red-500 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    body: 'text-red-700 dark:text-red-300',
  },
};

const ICONS: Record<AlertVariant, string> = {
  info: 'M11 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1z',
  success: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z',
  warning: 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  error: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z',
};

export function Alert({
  variant = 'info',
  title,
  description,
  dismissible,
  onDismiss,
  children,
  className,
  style,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const styles = VARIANT_CLASSES[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={[
        'rounded-lg border p-4',
        styles.wrapper,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="flex gap-3">
        <svg
          className={['h-5 w-5 shrink-0 mt-0.5', styles.icon].join(' ')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d={ICONS[variant]} clipRule="evenodd" />
        </svg>

        <div className="flex-1 min-w-0">
          {title && (
            <p className={['text-sm font-semibold', styles.title].join(' ')}>{title}</p>
          )}
          {description && (
            <p className={['text-sm mt-0.5', styles.body].join(' ')}>{description}</p>
          )}
          {children && <div className={['text-sm mt-1', styles.body].join(' ')}>{children}</div>}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={['shrink-0 -mt-0.5 h-5 w-5 opacity-70 hover:opacity-100 transition-opacity', styles.icon].join(' ')}
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
