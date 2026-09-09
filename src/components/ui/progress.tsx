import { cn } from '../../lib/utils';

export function Progress({
  value = 0,
  max = 100,
  className,
}: {
  value?: number;
  max?: number;
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-none bg-app-muted border border-app-border', className)}>
      <div
        className="h-full bg-brand-gold transition-all duration-300 ease-in-out rounded-none"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
