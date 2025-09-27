// Simple utility for combining class names without external dependencies
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Alias for backwards compatibility
export const classNames = cn;