import React, { createContext, useContext, useState } from 'react';

interface PopoverContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function Popover({ children }: PopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => context.onOpenChange(true),
    });
  }

  return (
    <button onClick={() => context.onOpenChange(true)}>
      {children}
    </button>
  );
}

export function PopoverContent({ children, className = "", align = "center" }: PopoverContentProps) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  if (!context.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        onClick={() => context.onOpenChange(false)}
      />
      
      {/* Content */}
      <div className={`absolute z-40 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${
        align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
      } ${className}`}>
        {children}
      </div>
    </>
  );
}