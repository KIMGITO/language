import { cn } from '../../lib/utils';

export function Separator({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'shrink-0 bg-app-border',
        orientation === 'horizontal' ? 'h-[1px] w-full my-3' : 'h-full w-[1px] mx-3',
        className
      )}
    />
  );
}
