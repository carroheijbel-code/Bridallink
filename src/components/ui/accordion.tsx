import React, { createContext, useContext, useState } from 'react';

interface AccordionContextType {
  value?: string;
  onValueChange?: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, type = 'single', collapsible, className = "" }: AccordionProps) {
  const [value, setValue] = useState<string>("");

  return (
    <AccordionContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, value, className = "" }: AccordionItemProps) {
  return (
    <div className={`border-b ${className}`}>
      {children}
    </div>
  );
}

export function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  
  return (
    <button className={`flex w-full items-center justify-between py-4 font-medium transition-all hover:underline ${className}`}>
      {children}
      <svg className="h-4 w-4 shrink-0 transition-transform duration-200">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
  );
}

export function AccordionContent({ children, className = "" }: AccordionContentProps) {
  return (
    <div className={`overflow-hidden text-sm transition-all ${className}`}>
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
}