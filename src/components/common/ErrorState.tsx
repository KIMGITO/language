import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to load content right now. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-3">
        <AlertTriangle className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="font-heading font-bold text-base text-rose-950 mb-1">
        {title}
      </h3>
      <p className="text-xs text-rose-700 leading-relaxed mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-rose-300 text-rose-800 hover:bg-rose-100/60"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
