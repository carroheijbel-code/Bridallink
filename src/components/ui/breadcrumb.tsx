import React from 'react';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbListProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

interface BreadcrumbEllipsisProps {
  className?: string;
}

export function Breadcrumb({ children, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={className}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({ children, className = "" }: BreadcrumbListProps) {
  return (
    <ol className={`flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 ${className}`}>
      {children}
    </ol>
  );
}

export function BreadcrumbItem({ children, className = "" }: BreadcrumbItemProps) {
  return (
    <li className={`inline-flex items-center gap-1.5 ${className}`}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ children, href, className = "" }: BreadcrumbLinkProps) {
  return (
    <a href={href} className={`transition-colors hover:text-foreground ${className}`}>
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children, className = "" }: BreadcrumbPageProps) {
  return (
    <span role="link" aria-disabled="true" aria-current="page" className={`font-normal text-foreground ${className}`}>
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({ children, className = "" }: BreadcrumbSeparatorProps) {
  return (
    <li role="presentation" aria-hidden="true" className={`[&>svg]:size-3.5 ${className}`}>
      {children || (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      )}
    </li>
  );
}

export function BreadcrumbEllipsis({ className = "" }: BreadcrumbEllipsisProps) {
  return (
    <span role="presentation" aria-hidden="true" className={`flex h-9 w-9 items-center justify-center ${className}`}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}