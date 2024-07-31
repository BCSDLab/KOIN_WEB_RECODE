import React, { useState } from 'react';

interface ImageWithErrorBoundaryProps {
  src: string;
  alt: string;
  className: string;
  fallback: React.ReactNode;
}

export default function ImageWithErrorBoundary({
  src,
  alt,
  className,
  fallback,
}: ImageWithErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {hasError ? (
        <div className={className}>{fallback}</div>
      ) : (
        <img
          src={src}
          className={className}
          onError={() => setHasError(true)}
          alt={alt}
        />
      )}
    </div>
  );
}
