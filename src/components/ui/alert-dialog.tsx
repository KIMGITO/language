import * as React from 'react';
import { Button } from './button';

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  isLoading?: boolean;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  variant = 'destructive',
  onConfirm,
  isLoading,
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-slate-950/40"
        onClick={() => !isLoading && onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-none bg-app-surface p-6 border border-app-border shadow-2xl">
        <h3 className="font-heading text-lg font-bold text-app-text mb-2">{title}</h3>
        <p className="text-sm text-app-text-muted leading-relaxed mb-6">{description}</p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? 'Please wait...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
