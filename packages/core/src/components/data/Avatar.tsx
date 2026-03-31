import type { CSSProperties } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  style?: CSSProperties;
}

const SIZE_CLASSES: Record<AvatarSize, { wrapper: string; text: string }> = {
  xs: { wrapper: 'h-6 w-6', text: 'text-xs' },
  sm: { wrapper: 'h-8 w-8', text: 'text-xs' },
  md: { wrapper: 'h-10 w-10', text: 'text-sm' },
  lg: { wrapper: 'h-12 w-12', text: 'text-base' },
  xl: { wrapper: 'h-16 w-16', text: 'text-lg' },
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

const BG_COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400',
  'bg-lime-500', 'bg-green-500', 'bg-teal-500', 'bg-cyan-500',
  'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
  'bg-purple-500', 'bg-pink-500',
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  className,
  style,
}: AvatarProps) {
  const sizeStyle = SIZE_CLASSES[size];
  const shapeClass = SHAPE_CLASSES[shape];
  const base = ['inline-flex shrink-0 items-center justify-center overflow-hidden', sizeStyle.wrapper, shapeClass, className ?? '']
    .filter(Boolean)
    .join(' ');

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        className={base}
        style={style}
      />
    );
  }

  if (name) {
    const bg = colorForName(name);
    return (
      <span
        className={[base, bg, 'text-white font-semibold select-none'].join(' ')}
        aria-label={name}
        style={style}
      >
        <span className={sizeStyle.text}>{getInitials(name)}</span>
      </span>
    );
  }

  // Generic placeholder
  return (
    <span className={[base, 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'].join(' ')} style={style}>
      <svg className="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </svg>
    </span>
  );
}
