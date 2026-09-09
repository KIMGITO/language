import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading language partners...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <Loader2 className="h-7 w-7 text-teal-600 animate-spin mb-3" />
      <p className="text-xs font-semibold text-stone-500">{message}</p>
    </div>
  );
}
