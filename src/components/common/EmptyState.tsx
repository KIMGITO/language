import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-none border border-app-border bg-app-surface p-8 sm:p-12 text-center max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="h-12 w-12 rounded-none bg-app-muted border border-app-border flex items-center justify-center text-brand-gold mx-auto mb-3.5">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="font-heading font-bold text-base text-app-text mb-1">
        {title}
      </h3>
      <p className="text-xs text-app-text-muted leading-relaxed max-w-sm mx-auto mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
