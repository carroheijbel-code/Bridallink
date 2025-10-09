import React, { useState, ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dy='0.3em' fill='%23666'%3EImage%3C/text%3E%3C/svg%3E",
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <img
      {...props}
      src={hasError ? fallback : src}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
        ...props.style
      }}
    />
  );
}