import React from 'react';

interface ToggleProps {
  children: React.ReactNode;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function Toggle({ 
  children, 
  pressed = false, 
  onPressedChange, 
  disabled, 
  className = "",
  variant = 'default',
  size = 'default'
}: ToggleProps) {
  const variants = {
    default: `bg-transparent hover:bg-muted hover:text-muted-foreground ${pressed ? 'bg-accent text-accent-foreground' : ''}`,
    outline: `border border-input bg-transparent hover:bg-accent hover:text-accent-foreground ${pressed ? 'bg-accent text-accent-foreground' : ''}`
  };

  const sizes = {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5"
  };

  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onPressedChange?.(!pressed)}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}