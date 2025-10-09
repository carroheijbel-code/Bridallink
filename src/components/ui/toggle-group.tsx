import React, { createContext, useContext } from 'react';

interface ToggleGroupContextType {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextType | undefined>(undefined);

interface ToggleGroupProps {
  children: React.ReactNode;
  type: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  disabled?: boolean;
}

interface ToggleGroupItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export function ToggleGroup({ 
  children, 
  type, 
  value = type === 'single' ? '' : [], 
  onValueChange, 
  className = "",
  disabled 
}: ToggleGroupProps) {
  const handleValueChange = (itemValue: string) => {
    if (disabled) return;
    
    if (type === 'single') {
      const newValue = value === itemValue ? '' : itemValue;
      onValueChange?.(newValue);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter(v => v !== itemValue)
        : [...currentValues, itemValue];
      onValueChange?.(newValues);
    }
  };

  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <div className={`flex items-center justify-center gap-1 ${className}`} role="group">
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({ children, value, className = "", disabled }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error('ToggleGroupItem must be used within ToggleGroup');

  const isPressed = context.type === 'single' 
    ? context.value === value 
    : Array.isArray(context.value) && context.value.includes(value);

  const handleClick = () => {
    if (!disabled) {
      context.onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      role={context.type === 'single' ? 'radio' : 'checkbox'}
      aria-pressed={isPressed}
      aria-checked={context.type === 'multiple' ? isPressed : undefined}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground h-10 px-3 ${
        isPressed ? 'bg-accent text-accent-foreground' : 'bg-transparent'
      } ${className}`}
    >
      {children}
    </button>
  );
}