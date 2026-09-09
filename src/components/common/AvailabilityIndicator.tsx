import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvailabilityIndicatorProps {
  availability?: string;
  timezone?: string;
  className?: string;
}

export function AvailabilityIndicator({
  availability = 'Flexible schedule',
  timezone,
  className,
}: AvailabilityIndicatorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200/60 rounded-lg px-2.5 py-1',
        className
      )}
    >
      <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
      <span className="truncate">{availability}</span>
      {timezone && <span className="text-stone-400 font-normal">· {timezone}</span>}
    </div>
  );
}
