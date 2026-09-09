import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'teal' | 'amber' | 'neutral' | 'blue' | 'gold' | 'emerald' | 'gradient' | 'purple';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-indigo-600 text-white font-semibold shadow-xs',
    gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-xs',
    blue: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-medium',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/50 font-medium',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200/80 font-medium',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
    gold: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    outline: 'border border-slate-200 text-slate-700 font-medium bg-white/80',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    neutral: 'bg-slate-100 text-slate-600 font-medium',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-150',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

