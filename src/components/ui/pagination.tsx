import React from 'react';

interface PaginationProps {
  children: React.ReactNode;
  className?: string;
}

interface PaginationContentProps {
  children: React.ReactNode;
  className?: string;
}

interface PaginationItemProps {
  children: React.ReactNode;
  className?: string;
}

interface PaginationLinkProps {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

interface PaginationPreviousProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

interface PaginationNextProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

interface PaginationEllipsisProps {
  className?: string;
}

export function Pagination({ children, className = "" }: PaginationProps) {
  return (
    <nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`}>
      {children}
    </nav>
  );
}

export function PaginationContent({ children, className = "" }: PaginationContentProps) {
  return (
    <ul className={`flex flex-row items-center gap-1 ${className}`}>
      {children}
    </ul>
  );
}

export function PaginationItem({ children, className = "" }: PaginationItemProps) {
  return (
    <li className={className}>
      {children}
    </li>
  );
}

export function PaginationLink({ 
  children, 
  href, 
  isActive, 
  className = "", 
  onClick 
}: PaginationLinkProps) {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2";
  const activeClasses = isActive ? "bg-accent text-accent-foreground" : "";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${activeClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses} ${className}`}>
      {children}
    </button>
  );
}

export function PaginationPrevious({ href, className = "", onClick }: PaginationPreviousProps) {
  const content = (
    <>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="15,18 9,12 15,6"></polyline>
      </svg>
      <span>Previous</span>
    </>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5 ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5 ${className}`}
    >
      {content}
    </button>
  );
}

export function PaginationNext({ href, className = "", onClick }: PaginationNextProps) {
  const content = (
    <>
      <span>Next</span>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5 ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5 ${className}`}
    >
      {content}
    </button>
  );
}

export function PaginationEllipsis({ className = "" }: PaginationEllipsisProps) {
  return (
    <span className={`flex h-9 w-9 items-center justify-center ${className}`}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
      </svg>
      <span className="sr-only">More pages</span>
    </span>
  );
}