import React, { useState, useRef, useEffect } from 'react';

interface InputOTPProps {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

interface InputOTPGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface InputOTPSlotProps {
  index: number;
  className?: string;
}

interface InputOTPSeparatorProps {
  className?: string;
}

const InputOTPContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
  maxLength: number;
  disabled: boolean;
} | undefined>(undefined);

export function InputOTP({ 
  maxLength = 6, 
  value = "", 
  onChange, 
  onComplete, 
  className = "",
  disabled = false 
}: InputOTPProps) {
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = value !== undefined ? value : internalValue;

  const setValue = (newValue: string) => {
    const filteredValue = newValue.replace(/[^0-9]/g, '').slice(0, maxLength);
    
    if (value === undefined) {
      setInternalValue(filteredValue);
    }
    
    onChange?.(filteredValue);
    
    if (filteredValue.length === maxLength) {
      onComplete?.(filteredValue);
    }
  };

  return (
    <InputOTPContext.Provider value={{ value: currentValue, setValue, maxLength, disabled }}>
      <div className={`flex items-center gap-2 ${className}`}>
        {Array.from({ length: maxLength }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </div>
    </InputOTPContext.Provider>
  );
}

export function InputOTPGroup({ children, className = "" }: InputOTPGroupProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}

export function InputOTPSlot({ index, className = "" }: InputOTPSlotProps) {
  const context = React.useContext(InputOTPContext);
  if (!context) throw new Error('InputOTPSlot must be used within InputOTP');

  const inputRef = useRef<HTMLInputElement>(null);
  const { value, setValue, maxLength, disabled } = context;
  const currentChar = value[index] || '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (currentChar) {
        // Remove current character
        const newValue = value.slice(0, index) + value.slice(index + 1);
        setValue(newValue);
      } else if (index > 0) {
        // Focus previous input and remove its character
        const prevInput = inputRef.current?.parentElement?.children[index - 1] as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          const newValue = value.slice(0, index - 1) + value.slice(index);
          setValue(newValue);
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = inputRef.current?.parentElement?.children[index - 1] as HTMLInputElement;
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
      const nextInput = inputRef.current?.parentElement?.children[index + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChar = e.target.value.replace(/[^0-9]/g, '');
    
    if (newChar) {
      const newValue = value.slice(0, index) + newChar + value.slice(index + 1);
      setValue(newValue);
      
      // Focus next input
      if (index < maxLength - 1) {
        const nextInput = inputRef.current?.parentElement?.children[index + 1] as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      maxLength={1}
      value={currentChar}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`h-10 w-10 text-center text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}

export function InputOTPSeparator({ className = "" }: InputOTPSeparatorProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
      </svg>
    </div>
  );
}