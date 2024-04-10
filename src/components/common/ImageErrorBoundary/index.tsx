import React, { useState } from 'react';

interface ImageErrorBoundaryProps {
  src: string;
  alt: string;
  className: string;
  fallback: React.ReactNode;
}

export default function ImageErrorBoundary({
  src,
  alt,
  className,
  fallback,
}: ImageErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {hasError ? (
        <div className={className}>
          {fallback}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
