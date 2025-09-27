import React, { createContext, useContext, useState } from 'react';

interface AlertDialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

interface AlertDialogProps {
  children: React.ReactNode;
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AlertDialog({ children }: AlertDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children, asChild }: AlertDialogTriggerProps) {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogTrigger must be used within AlertDialog');

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

export function AlertDialogContent({ children, className = "" }: AlertDialogContentProps) {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogContent must be used within AlertDialog');

  if (!context.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => context.onOpenChange(false)} />
      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        <div className={`grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg ${className}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export function AlertDialogHeader({ children, className = "" }: AlertDialogHeaderProps) {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ children, className = "" }: AlertDialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
}

export function AlertDialogDescription({ children, className = "" }: AlertDialogDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({ children, className = "" }: AlertDialogFooterProps) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
}

export function AlertDialogAction({ children, onClick, className = "" }: AlertDialogActionProps) {
  const context = useContext(AlertDialogContext);

  const handleClick = () => {
    onClick?.();
    context?.onOpenChange(false);
  };

  return (
    <button onClick={handleClick} className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ${className}`}>
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, onClick, className = "" }: AlertDialogCancelProps) {
  const context = useContext(AlertDialogContext);

  const handleClick = () => {
    onClick?.();
    context?.onOpenChange(false);
  };

  return (
    <button onClick={handleClick} className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold ${className}`}>
      {children}
    </button>
  );
}