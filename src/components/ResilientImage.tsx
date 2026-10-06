import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[var(--color-surface-elevated)] text-[var(--color-primary)] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'KBR Masale botanical illustration'}
      >
        <Sparkles className="h-8 w-8 text-[var(--color-secondary)] mb-2 opacity-80" />
        {fallbackTitle && (
          <span className="font-display text-base font-semibold text-[var(--color-text)]">
            {fallbackTitle}
          </span>
        )}
        {fallbackSubtitle && (
          <span className="mt-1 text-xs text-[var(--color-text-muted)]">
            {fallbackSubtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
