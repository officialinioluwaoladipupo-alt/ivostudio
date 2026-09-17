import React from 'react';

/**
 * Sanity-ready image primitive.
 * Accepts a Sanity image reference, a queried asset URL, or a temporary URL.
 * Sanity URLs are transformed to AVIF/WebP through query parameters when served.
 */
export function ResponsiveImage({ source, alt = '', width, height, sizes = '100vw', loading = 'lazy', priority = false, decorative = false, className = '', style, ...props }) {
  const raw = typeof source === 'string' ? source : source?.asset?.url || source?.url || '';
  if (!raw) return null;
  const base = raw.includes('?') ? raw.split('?')[0] : raw;
  const params = raw.includes('images.unsplash.com') ? '' : '&auto=format';
  const src = `${base}?fm=webp&q=82&w=${width || 1600}${params}`;
  const srcSet = [480, 768, 1024, 1440, 1920].map(size => `${base}?fm=webp&q=82&w=${size}${params} ${size}w`).join(', ');
  return <img src={src} srcSet={srcSet} sizes={sizes} width={width} height={height} loading={priority ? 'eager' : loading} fetchPriority={priority ? 'high' : undefined} decoding="async" alt={decorative ? '' : alt} className={className} style={style} {...props} />;
}

export default ResponsiveImage;
