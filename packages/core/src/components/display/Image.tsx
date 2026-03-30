import type { CSSProperties } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  className?: string;
  style?: CSSProperties;
}

const OBJECT_FIT_CLASSES: Record<NonNullable<ImageProps['objectFit']>, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
};

export function Image({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  className,
  style,
}: ImageProps) {
  const classes = [OBJECT_FIT_CLASSES[objectFit], className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={classes}
      style={style}
    />
  );
}
