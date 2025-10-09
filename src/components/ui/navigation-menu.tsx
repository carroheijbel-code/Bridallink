import React, { createContext, useContext, useState } from 'react';

interface NavigationMenuContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextType | undefined>(undefined);

interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuListProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuItemProps {
  children: React.ReactNode;
  value?: string;
  className?: string;
}

interface NavigationMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

interface NavigationMenuIndicatorProps {
  className?: string;
}

interface NavigationMenuViewportProps {
  className?: string;
}

export function NavigationMenu({ children, className = "" }: NavigationMenuProps) {
  const [value, setValue] = useState("");

  return (
    <NavigationMenuContext.Provider value={{ value, onValueChange: setValue }}>
      <nav className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`}>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({ children, className = "" }: NavigationMenuListProps) {
  return (
    <div className={`group flex flex-1 list-none items-center justify-center space-x-1 ${className}`}>
      {children}
    </div>
  );
}

export function NavigationMenuItem({ children, value, className = "" }: NavigationMenuItemProps) {
  const context = useContext(NavigationMenuContext);
  
  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            value,
            isActive: context?.value === value 
          });
        }
        return child;
      })}
    </div>
  );
}

export function NavigationMenuTrigger({ children, className = "", ...props }: NavigationMenuTriggerProps & { value?: string; isActive?: boolean }) {
  const context = useContext(NavigationMenuContext);
  const value = (props as any).value;
  const isActive = (props as any).isActive;

  const handleClick = () => {
    if (value) {
      context?.onValueChange(isActive ? "" : value);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? 'bg-accent text-accent-foreground' : ''
      } ${className}`}
    >
      {children}
      <svg className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
  );
}

export function NavigationMenuContent({ children, className = "" }: NavigationMenuContentProps) {
  return (
    <div className={`absolute left-0 top-0 w-full ${className}`}>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-auto">
        <div className="w-full overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

export function NavigationMenuLink({ children, href, className = "" }: NavigationMenuLinkProps) {
  return (
    <a
      href={href}
      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      {children}
    </a>
  );
}

export function NavigationMenuIndicator({ className = "" }: NavigationMenuIndicatorProps) {
  return (
    <div className={`top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden ${className}`}>
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  );
}

export function NavigationMenuViewport({ className = "" }: NavigationMenuViewportProps) {
  return (
    <div className={`absolute left-0 top-full flex justify-center ${className}`}>
      <div className="w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg" />
    </div>
  );
}