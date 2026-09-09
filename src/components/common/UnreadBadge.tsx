import React from 'react';
import { cn } from '../../lib/utils';

export function UnreadBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-none bg-brand-gold text-brand-gold-text text-[11px] font-bold border border-brand-gold leading-none',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
