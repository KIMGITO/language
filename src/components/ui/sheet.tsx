import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'bottom';
  className?: string;
  title?: string;
  description?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = 'right',
  className,
  title,
  description,
}: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-full max-w-md border-l border-slate-200/80 rounded-l-3xl animate-in slide-in-from-right duration-200',
    left: 'inset-y-0 left-0 h-full w-full max-w-xs border-r border-slate-200/80 rounded-r-3xl animate-in slide-in-from-left duration-200',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] w-full border-t border-slate-200/80 rounded-t-3xl animate-in slide-in-from-bottom duration-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed z-50 flex flex-col bg-white p-6 shadow-2xl transition ease-in-out',
          sideClasses[side],
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            {title && <h2 className="font-heading text-lg font-bold text-slate-900">{title}</h2>}
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

