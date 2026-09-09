import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvailabilityBadgeProps {
  availability: string;
  className?: string;
  showIcon?: boolean;
}

export function AvailabilityBadge({
  availability,
  className,
  showIcon = true,
}: AvailabilityBadgeProps) {
  if (!availability) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-app-text-muted bg-app-muted border border-app-border px-2 py-0.5 rounded-none',
        className
      )}
    >
      {showIcon && <Clock className="h-3 w-3 text-app-text-muted shrink-0" />}
      <span className="truncate">{availability}</span>
    </span>
  );
}
