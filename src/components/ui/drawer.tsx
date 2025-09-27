import React, { createContext, useContext, useState, useEffect } from 'react';

interface DrawerContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerCloseProps {
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ children, open, onOpenChange }: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DrawerContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({ children, asChild }: DrawerTriggerProps) {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerTrigger must be used within Drawer');

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

export function DrawerContent({ children, className = "" }: DrawerContentProps) {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerContent must be used within Drawer');

  useEffect(() => {
    if (context.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [context.open]);

  if (!context.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => context.onOpenChange(false)}
      />
      
      <div className={`fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background ${className}`}>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </div>
    </>
  );
}

export function DrawerHeader({ children, className = "" }: DrawerHeaderProps) {
  return (
    <div className={`grid gap-1.5 p-4 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export function DrawerTitle({ children, className = "" }: DrawerTitleProps) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function DrawerDescription({ children, className = "" }: DrawerDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function DrawerFooter({ children, className = "" }: DrawerFooterProps) {
  return (
    <div className={`mt-auto flex flex-col gap-2 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function DrawerClose({ children, className = "" }: DrawerCloseProps) {
  const context = useContext(DrawerContext);

  return (
    <button onClick={() => context?.onOpenChange(false)} className={className}>
      {children}
    </button>
  );
}