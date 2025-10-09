import React, { createContext, useContext, useState } from 'react';

interface ContextMenuContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

interface ContextMenuProps {
  children: React.ReactNode;
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface ContextMenuSeparatorProps {
  className?: string;
}

interface ContextMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, onOpenChange: setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ children, className = "" }: ContextMenuTriggerProps) {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenuTrigger must be used within ContextMenu');

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    context.setPosition({ x: e.clientX, y: e.clientY });
    context.onOpenChange(true);
  };

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}
    </div>
  );
}

export function ContextMenuContent({ children, className = "" }: ContextMenuContentProps) {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenuContent must be used within ContextMenu');

  if (!context.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => context.onOpenChange(false)} />
      <div 
        className={`fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
        style={{ left: context.position.x, top: context.position.y }}
      >
        {children}
      </div>
    </>
  );
}

export function ContextMenuItem({ children, onClick, className = "", disabled }: ContextMenuItemProps) {
  const context = useContext(ContextMenuContext);

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      context?.onOpenChange(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function ContextMenuSeparator({ className = "" }: ContextMenuSeparatorProps) {
  return <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />;
}

export function ContextMenuLabel({ children, className = "" }: ContextMenuLabelProps) {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold text-foreground ${className}`}>
      {children}
    </div>
  );
}