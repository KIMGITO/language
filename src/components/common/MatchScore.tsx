import React from 'react';
import { CheckCircle2, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MatchScoreProps {
  score?: number;
  reasons?: string[];
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScore({
  reasons = [],
  showDetails = false,
  className,
  size = 'md',
}: MatchScoreProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-none border border-app-border bg-app-muted px-2.5 py-1 text-xs font-medium text-app-text',
            size === 'sm' && 'text-xs px-2 py-0.5',
            size === 'md' && 'text-xs px-2.5 py-1',
            size === 'lg' && 'text-sm px-3 py-1.5'
          )}
        >
          <Users className="h-3.5 w-3.5 text-brand-gold shrink-0" />
          <span>Match Compatibility</span>
        </div>
      </div>

      {showDetails && reasons.length > 0 && (
        <div className="mt-1 space-y-1.5">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-app-text-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
