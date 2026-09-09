import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Language } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface PracticeLanguageSelectorProps {
  currentLanguage: Language;
  alternateLanguage?: Language;
  onSwitchLanguage?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function PracticeLanguageSelector({
  currentLanguage,
  alternateLanguage,
  onSwitchLanguage,
  className,
}: PracticeLanguageSelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 bg-app-muted border border-app-border px-3 py-1.5 rounded-none',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-app-text-muted uppercase tracking-wider">
          Language:
        </span>
        <span className="text-base leading-none select-none">{currentLanguage.flag || '🌐'}</span>
        <span className="text-xs font-bold text-app-text">{currentLanguage.name}</span>
      </div>

      {alternateLanguage && onSwitchLanguage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSwitchLanguage}
          className="h-6 px-2 text-[11px] font-semibold gap-1 rounded-none border-app-border"
          title={`Switch to ${alternateLanguage.name}`}
        >
          <ArrowLeftRight className="h-3 w-3 text-brand-gold" />
          <span>Switch</span>
        </Button>
      )}
    </div>
  );
}
