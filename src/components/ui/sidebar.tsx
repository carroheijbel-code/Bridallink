import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  state: 'open' | 'closed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SidebarProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  className?: string;
}

interface SidebarTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

interface SidebarMenuActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarProvider({ 
  children, 
  defaultOpen = true, 
  open, 
  onOpenChange 
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!isOpen);
    }
  };

  return (
    <SidebarContext.Provider value={{
      state: isOpen ? 'open' : 'closed',
      open: isOpen,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ 
  children, 
  side = 'left', 
  variant = 'sidebar', 
  collapsible = 'offcanvas', 
  className = "" 
}: SidebarProps) {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('Sidebar must be used within SidebarProvider');

  const { open, openMobile, isMobile } = context;
  const isOpen = isMobile ? openMobile : open;

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => context.setOpenMobile(false)}
        />
      )}
      <div className={`group flex flex-col border-r bg-background transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'} ${
        side === 'right' ? 'border-l border-r-0' : ''
      } ${className}`}>
        {children}
      </div>
    </>
  );
}

export function SidebarTrigger({ children, className = "" }: SidebarTriggerProps) {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('SidebarTrigger must be used within SidebarProvider');

  return (
    <button
      onClick={context.toggleSidebar}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 ${className}`}
    >
      {children || (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      )}
    </button>
  );
}

export function SidebarContent({ children, className = "" }: SidebarContentProps) {
  return (
    <div className={`flex flex-1 flex-col gap-2 overflow-auto p-2 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarHeader({ children, className = "" }: SidebarHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 p-2 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className = "" }: SidebarFooterProps) {
  return (
    <div className={`flex flex-col gap-2 p-2 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children, className = "" }: SidebarGroupProps) {
  return (
    <div className={`relative flex w-full flex-col gap-1 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ children, className = "" }: SidebarGroupLabelProps) {
  return (
    <div className={`flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground/70 outline-none ring-offset-background transition-[margin,opa] duration-200 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className = "" }: SidebarGroupContentProps) {
  return (
    <div className={`w-full text-sm ${className}`}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className = "" }: SidebarMenuProps) {
  return (
    <ul className={`flex w-full min-w-0 flex-col gap-1 ${className}`}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({ children, className = "" }: SidebarMenuItemProps) {
  return (
    <li className={`relative flex w-full min-w-0 items-center ${className}`}>
      {children}
    </li>
  );
}

export function SidebarMenuButton({ 
  children, 
  asChild, 
  isActive, 
  className = "", 
  onClick 
}: SidebarMenuButtonProps) {
  const baseClasses = `peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-offset-background transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 ${
    isActive ? 'bg-accent text-accent-foreground' : ''
  }`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: `${baseClasses} ${className}`,
      onClick
    });
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}

export function SidebarMenuAction({ children, className = "", onClick }: SidebarMenuActionProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-offset-background transition-transform hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 peer-hover/menu-button:text-accent-foreground ${className}`}
    >
      {children}
    </button>
  );
}

export function SidebarInset({ children, className = "" }: SidebarInsetProps) {
  return (
    <main className={`flex flex-1 flex-col ${className}`}>
      {children}
    </main>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};