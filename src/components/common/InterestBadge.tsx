import React from 'react';
import { cn } from '../../lib/utils';

interface InterestBadgeProps {
  interest: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function InterestBadge({
  interest,
  selected = false,
  onClick,
  className,
}: InterestBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors',
        selected
          ? 'bg-teal-700 text-white shadow-2xs'
          : 'bg-stone-100/80 text-stone-700 border border-stone-200/60 hover:bg-stone-200/70',
        !onClick && 'cursor-default pointer-events-none',
        className
      )}
    >
      {interest}
    </button>
  );
}
