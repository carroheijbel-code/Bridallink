import React from 'react';

interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number;
  className?: string;
}

export function AspectRatio({ children, ratio = 1, className = "" }: AspectRatioProps) {
  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: `${100 / ratio}%` }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}