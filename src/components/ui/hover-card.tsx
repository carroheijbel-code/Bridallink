import React, { createContext, useContext, useState } from 'react';

interface HoverCardContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HoverCardContext = createContext<HoverCardContextType | undefined>(undefined);

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

interface HoverCardTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface HoverCardContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function HoverCard({ children, openDelay = 700, closeDelay = 300 }: HoverCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCardContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative">
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

export function HoverCardTrigger({ children, asChild, className = "" }: HoverCardTriggerProps) {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardTrigger must be used within HoverCard');

  const handleMouseEnter = () => {
    context.onOpenChange(true);
  };

  const handleMouseLeave = () => {
    context.onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
}

export function HoverCardContent({ 
  children, 
  className = "", 
  align = "center", 
  side = "top" 
}: HoverCardContentProps) {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardContent must be used within HoverCard');

  if (!context.open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2 top-0',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2 top-0'
  };

  return (
    <div 
      className={`absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${sideClasses[side]} ${alignmentClasses[align]} ${className}`}
      onMouseEnter={() => context.onOpenChange(true)}
      onMouseLeave={() => context.onOpenChange(false)}
    >
      {children}
    </div>
  );
}