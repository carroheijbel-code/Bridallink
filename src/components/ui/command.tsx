import React, { createContext, useContext, useState } from 'react';

interface CommandContextType {
  search: string;
  setSearch: (search: string) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

interface CommandProps {
  children: React.ReactNode;
  className?: string;
}

interface CommandInputProps {
  placeholder?: string;
  className?: string;
}

interface CommandListProps {
  children: React.ReactNode;
  className?: string;
}

interface CommandEmptyProps {
  children: React.ReactNode;
  className?: string;
}

interface CommandGroupProps {
  children: React.ReactNode;
  heading?: string;
  className?: string;
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

export function Command({ children, className = "" }: CommandProps) {
  const [search, setSearch] = useState("");

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ${className}`}>
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export function CommandInput({ placeholder, className = "" }: CommandInputProps) {
  const context = useContext(CommandContext);
  if (!context) throw new Error('CommandInput must be used within Command');

  return (
    <div className="flex items-center border-b px-3">
      <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        placeholder={placeholder}
        value={context.search}
        onChange={(e) => context.setSearch(e.target.value)}
      />
    </div>
  );
}

export function CommandList({ children, className = "" }: CommandListProps) {
  return (
    <div className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CommandEmpty({ children, className = "" }: CommandEmptyProps) {
  const context = useContext(CommandContext);
  if (!context) throw new Error('CommandEmpty must be used within Command');

  return (
    <div className={`py-6 text-center text-sm ${className}`}>
      {children}
    </div>
  );
}

export function CommandGroup({ children, heading, className = "" }: CommandGroupProps) {
  return (
    <div className={`overflow-hidden p-1 text-foreground ${className}`}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export function CommandItem({ children, onSelect, className = "" }: CommandItemProps) {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground ${className}`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
}