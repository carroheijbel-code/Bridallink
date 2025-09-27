import React, { createContext, useContext, useState } from 'react';

interface CarouselContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  itemsCount: number;
  setItemsCount: (count: number) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselPreviousProps {
  className?: string;
}

interface CarouselNextProps {
  className?: string;
}

export function Carousel({ children, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, itemsCount, setItemsCount }}>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ children, className = "" }: CarouselContentProps) {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselContent must be used within Carousel');

  const childrenArray = React.Children.toArray(children);
  
  React.useEffect(() => {
    context.setItemsCount(childrenArray.length);
  }, [childrenArray.length, context]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${context.currentIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({ children, className = "" }: CarouselItemProps) {
  return (
    <div className={`w-full flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
}

export function CarouselPrevious({ className = "" }: CarouselPreviousProps) {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselPrevious must be used within Carousel');

  const handlePrevious = () => {
    context.setCurrentIndex(Math.max(0, context.currentIndex - 1));
  };

  return (
    <button 
      onClick={handlePrevious}
      disabled={context.currentIndex === 0}
      className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md disabled:opacity-50 ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="15,18 9,12 15,6"></polyline>
      </svg>
    </button>
  );
}

export function CarouselNext({ className = "" }: CarouselNextProps) {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselNext must be used within Carousel');

  const handleNext = () => {
    context.setCurrentIndex(Math.min(context.itemsCount - 1, context.currentIndex + 1));
  };

  return (
    <button 
      onClick={handleNext}
      disabled={context.currentIndex === context.itemsCount - 1}
      className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md disabled:opacity-50 ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </button>
  );
}