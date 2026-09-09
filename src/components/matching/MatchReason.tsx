import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MatchReasonProps {
  reasons: string[];
  title?: string;
  className?: string;
  showBulletCheck?: boolean;
}

export function MatchReason({
  reasons,
  title = 'Compatibility',
  className,
  showBulletCheck = true,
}: MatchReasonProps) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={cn('space-y-1.5', className)}>
      {title && (
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-app-text-muted">
          {title}
        </h4>
      )}
      <ul className="space-y-1 text-xs text-app-text">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {showBulletCheck && (
              <span className="text-brand-blue shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            )}
            <span className="leading-snug">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
