import React from 'react';
import { LanguageProficiency } from '../../types';
import { cn } from '../../lib/utils';

interface LanguageLevelProps {
  level: LanguageProficiency | string;
  variant?: 'subtle' | 'outline' | 'filled';
  className?: string;
}

export function LanguageLevel({
  level,
  className,
}: LanguageLevelProps) {
  const isHighLevel = ['native', 'fluent', 'advanced'].includes(level.toLowerCase());

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-none border',
        isHighLevel
          ? 'bg-brand-blue-subtle text-brand-blue border-brand-blue-border'
          : 'bg-brand-gold-subtle text-brand-gold-text border-brand-gold-border',
        className
      )}
    >
      {level}
    </span>
  );
}
