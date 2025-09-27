import React from 'react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export default function MobileOptimizations({ children }: MobileOptimizationsProps) {
  // Simple mobile wrapper without Capacitor dependencies
  // This prevents webpack errors while keeping mobile styles
  
  return (
    <div className="mobile-app">
      {children}
    </div>
  );
}