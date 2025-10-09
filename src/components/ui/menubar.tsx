import React, { createContext, useContext, useState } from 'react';

interface MenubarContextType {
  openMenu: string | null;
  setOpenMenu: (menu: string | null) => void;
}

const MenubarContext = createContext<MenubarContextType | undefined>(undefined);

interface MenubarProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarMenuProps {
  children: React.ReactNode;
  value: string;
}

interface MenubarTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

interface MenubarItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface MenubarSeparatorProps {
  className?: string;
}

interface MenubarLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

interface MenubarRadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface MenubarRadioItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface MenubarSubProps {
  children: React.ReactNode;
}

interface MenubarSubTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarSubContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Menubar({ children, className = "" }: MenubarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu }}>
      <div className={`flex h-10 items-center space-x-1 rounded-md border bg-background p-1 ${className}`}>
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

export function MenubarMenu({ children, value }: MenubarMenuProps) {
  const context = useContext(MenubarContext);
  if (!context) throw new Error('MenubarMenu must be used within Menubar');

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value });
        }
        return child;
      })}
    </div>
  );
}

export function MenubarTrigger({ children, className = "", ...props }: MenubarTriggerProps & { value?: string }) {
  const context = useContext(MenubarContext);
  if (!context) throw new Error('MenubarTrigger must be used within MenubarMenu');

  const value = (props as any).value;
  const isOpen = context.openMenu === value;

  const handleClick = () => {
    context.setOpenMenu(isOpen ? null : value);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${
        isOpen ? 'bg-accent text-accent-foreground' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function MenubarContent({ children, className = "", align = "start" }: MenubarContentProps) {
  const context = useContext(MenubarContext);
  if (!context) throw new Error('MenubarContent must be used within MenubarMenu');

  // This is a simplified implementation - in a real component you'd want to get the value from context
  const isOpen = context.openMenu !== null;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => context.setOpenMenu(null)} />
      <div className={`absolute top-full z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${
        align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
      } ${className}`}>
        {children}
      </div>
    </>
  );
}

export function MenubarItem({ children, onClick, className = "", disabled }: MenubarItemProps) {
  const context = useContext(MenubarContext);

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      context?.setOpenMenu(null);
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

export function MenubarSeparator({ className = "" }: MenubarSeparatorProps) {
  return <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />;
}

export function MenubarLabel({ children, className = "" }: MenubarLabelProps) {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
      {children}
    </div>
  );
}

export function MenubarCheckboxItem({ 
  children, 
  checked, 
  onCheckedChange, 
  className = "" 
}: MenubarCheckboxItemProps) {
  return (
    <button
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

export function MenubarRadioGroup({ children, value, onValueChange }: MenubarRadioGroupProps) {
  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            checked: (child.props as any).value === value,
            onSelect: () => onValueChange?.((child.props as any).value)
          });
        }
        return child;
      })}
    </div>
  );
}

export function MenubarRadioItem({ children, value, className = "", ...props }: MenubarRadioItemProps & { checked?: boolean; onSelect?: () => void }) {
  const checked = (props as any).checked;
  const onSelect = (props as any).onSelect;

  return (
    <button
      onClick={onSelect}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <div className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      {children}
    </button>
  );
}

export function MenubarSub({ children }: MenubarSubProps) {
  return <div>{children}</div>;
}

export function MenubarSubTrigger({ children, className = "" }: MenubarSubTriggerProps) {
  return (
    <button className={`flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}>
      {children}
      <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </button>
  );
}

export function MenubarSubContent({ children, className = "" }: MenubarSubContentProps) {
  return (
    <div className={`absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ${className}`}>
      {children}
    </div>
  );
}