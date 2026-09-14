import { Globe2, MessageSquare, Compass, Users, Sparkles, HelpCircle, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ChatSpace {
  id: string;
  name: string;
  short: string;
  icon?: string;
  badge?: number;
}

interface ChatSpaceRailProps {
  spaces?: ChatSpace[];
  activeSpaceId: string;
  onSelectSpace: (spaceId: string) => void;
  onNewChat: () => void;
  className?: string;
}

const DEFAULT_SPACES: ChatSpace[] = [
  { id: 'all', name: 'Main Hub', short: 'Main' },
  { id: 'icq', name: 'LC Chat', short: 'LC', badge: 3 },
  { id: 'spanish', name: 'Spanish Circle', short: 'SP' },
  { id: 'app', name: 'Practice Lab', short: 'APP' },
  { id: 'nairobi', name: 'Nairobi Hub', short: 'NU' },
  { id: 'direct', name: 'Direct Messages', short: 'DI' },
];

export function ChatSpaceRail({
  spaces = DEFAULT_SPACES,
  activeSpaceId,
  onSelectSpace,
  onNewChat,
  className,
}: ChatSpaceRailProps) {
  return (
    <aside
      className={cn(
        'w-16 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col items-center justify-between py-4 select-none shrink-0 z-10',
        className
      )}
    >
      {/* Top Logo and Space Items */}
      <div className="flex flex-col items-center gap-3.5 w-full px-2">
        {/* Main Logo Brand Mark */}
        <button
          type="button"
          onClick={() => onSelectSpace('all')}
          title="LinguaConnect"
          className="h-11 w-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-heading font-black text-lg shadow-lg shadow-teal-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="font-extrabold tracking-tighter">L</span>
        </button>

        <div className="h-[1px] w-8 bg-slate-100 dark:bg-slate-800 my-0.5" />

        {/* Vertical Space Shortcuts */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          {spaces.map((space) => {
            const isActive = activeSpaceId === space.id;
            return (
              <button
                key={space.id}
                type="button"
                onClick={() => onSelectSpace(space.id)}
                title={space.name}
                className={cn(
                  'relative h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer border',
                  isActive
                    ? 'bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100'
                )}
              >
                <span className="uppercase text-[11px] tracking-tight">{space.short}</span>

                {/* Left Active indicator bar */}
                {isActive && (
                  <span className="absolute -left-2 top-2 bottom-2 w-1 bg-teal-500 rounded-r-full shadow-sm" />
                )}

                {/* Badge */}
                {space.badge && space.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border border-white dark:border-slate-900">
                    {space.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onSelectSpace('info')}
            title="Help & Safety Tips"
            className={cn(
              'h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer border',
              activeSpaceId === 'info'
                ? 'bg-teal-500 text-white border-teal-400'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100'
            )}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom Plus Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onNewChat}
          title="New conversation / Find partner"
          className="h-11 w-11 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer border-0"
          aria-label="New chat"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>
      </div>
    </aside>
  );
}
