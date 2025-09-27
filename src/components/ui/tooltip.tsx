import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: [React.ReactElement, React.ReactElement];
}

interface TooltipTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
}

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}

export function Tooltip({ children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [trigger, content] = children;

  return (
    <div className="relative inline-block">
      {React.cloneElement(trigger, {
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
      })}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          {content}
        </div>
      )}
    </div>
  );
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  return children;
}

export function TooltipContent({ children, className = "" }: TooltipContentProps) {
  return (
    <div className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}>
      {children}
    </div>
  );
}