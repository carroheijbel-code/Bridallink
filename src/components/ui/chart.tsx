import React from 'react';

interface ChartProps {
  children: React.ReactNode;
  className?: string;
}

interface ChartContainerProps {
  children: React.ReactNode;
  config?: any;
  className?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  className?: string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  className?: string;
}

interface ChartLegendProps {
  payload?: any[];
  className?: string;
}

interface ChartLegendContentProps {
  payload?: any[];
  className?: string;
}

export function Chart({ children, className = "" }: ChartProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}

export function ChartContainer({ children, config, className = "" }: ChartContainerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, className = "" }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={`rounded-lg border bg-background p-2 shadow-sm ${className}`}>
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function ChartTooltipContent({ active, payload, label, className = "" }: ChartTooltipContentProps) {
  return (
    <ChartTooltip active={active} payload={payload} label={label} className={className} />
  );
}

export function ChartLegend({ payload, className = "" }: ChartLegendProps) {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegendContent({ payload, className = "" }: ChartLegendContentProps) {
  return (
    <ChartLegend payload={payload} className={className} />
  );
}