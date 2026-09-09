import React from 'react';
import { cn } from '../../lib/utils';
import { Language, LanguageProficiency } from '../../types';

interface LanguageBadgeProps {
  key?: React.Key;
  language: string | Language;
  code?: string;
  flag?: string;
  showFlag?: boolean;
  level?: LanguageProficiency | string;
  type?: 'native' | 'learning';
  className?: string;
  size?: 'sm' | 'md';
}

export function LanguageBadge({
  language,
  flag,
  showFlag = true,
  level,
  type = 'learning',
  className,
  size = 'md',
}: LanguageBadgeProps) {
  const langName = typeof language === 'string' ? language : language.name;
  const langFlag = flag || (typeof language === 'object' ? language.flag : undefined);
  const isNative = type === 'native' || level === 'Native';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-none border font-medium select-none',
        isNative
          ? 'bg-brand-blue-subtle border-brand-blue-border text-brand-blue'
          : 'bg-brand-gold-subtle border-brand-gold-border text-brand-gold-text',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {showFlag && langFlag && <span className="text-xs shrink-0">{langFlag}</span>}
      <span className="font-semibold">{langName}</span>
      {level && (
        <span
          className={cn(
            'text-[10px] uppercase font-bold tracking-wider rounded-none px-1.5 py-0.5 border',
            isNative
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-brand-gold text-brand-gold-text border-brand-gold'
          )}
        >
          {level}
        </span>
      )}
    </div>
  );
}
