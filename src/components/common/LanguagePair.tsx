import React from 'react';
import { ArrowLeftRight, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LanguagePairProps {
  speaks: string;
  learning: string;
  speaksLevel?: string;
  learningLevel?: string;
  bidirectional?: boolean;
  className?: string;
}

export function LanguagePair({
  speaks,
  learning,
  speaksLevel,
  learningLevel,
  bidirectional = true,
  className,
}: LanguagePairProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-none bg-app-muted px-3 py-1.5 text-xs text-app-text border border-app-border font-medium',
        className
      )}
    >
      <div className="flex items-center gap-1">
        <span className="font-semibold text-app-text">{speaks}</span>
        {speaksLevel && <span className="text-[10px] text-app-text-muted">({speaksLevel})</span>}
      </div>

      {bidirectional ? (
        <ArrowLeftRight className="h-3.5 w-3.5 text-brand-gold shrink-0" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5 text-app-text-muted shrink-0" />
      )}

      <div className="flex items-center gap-1">
        <span className="font-semibold text-app-text">{learning}</span>
        {learningLevel && <span className="text-[10px] text-brand-blue font-semibold">({learningLevel})</span>}
      </div>
    </div>
  );
}
