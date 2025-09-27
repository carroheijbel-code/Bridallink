import React, { createContext, useContext } from 'react';

interface FormContextType {
  name?: string;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

interface FormFieldProps {
  children: React.ReactNode;
  name: string;
  className?: string;
}

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
}

export function Form({ children, onSubmit, className = "" }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

export function FormField({ children, name, className = "" }: FormFieldProps) {
  return (
    <FormContext.Provider value={{ name }}>
      <div className={className}>
        {children}
      </div>
    </FormContext.Provider>
  );
}

export function FormItem({ children, className = "" }: FormItemProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

export function FormLabel({ children, className = "" }: FormLabelProps) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
}

export function FormControl({ children, className = "" }: FormControlProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function FormDescription({ children, className = "" }: FormDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function FormMessage({ children, className = "" }: FormMessageProps) {
  if (!children) return null;
  
  return (
    <p className={`text-sm font-medium text-destructive ${className}`}>
      {children}
    </p>
  );
}