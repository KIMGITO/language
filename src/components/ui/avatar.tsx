import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback = 'U',
  size = 'md',
  isOnline,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  };

  const dotSizes = {
    sm: 'h-2.5 w-2.5 ring-2',
    md: 'h-3 w-3 ring-2',
    lg: 'h-3.5 w-3.5 ring-2',
    xl: 'h-4 w-4 ring-2',
  };

  return (
    <div className={cn('relative inline-flex shrink-0 rounded-full', className)} {...props}>
      <div
        className={cn(
          'relative flex overflow-hidden rounded-full border border-slate-200 bg-gradient-to-br from-indigo-50 to-violet-100 items-center justify-center font-bold text-indigo-600 select-none shadow-sm',
          sizeClasses[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <span className="uppercase tracking-wider font-display font-bold">{fallback}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white shadow-sm',
            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300',
            dotSizes[size]
          )}
          title={isOnline ? 'Active now' : 'Offline'}
        />
      )}
    </div>
  );
}

