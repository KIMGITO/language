import React from 'react';
import { motion } from 'motion/react';
import { Home, Compass, Users, MessageSquare, User } from 'lucide-react';
import { useUiStore, AppRoute } from '../../stores/uiStore';
import { useChatStore } from '../../stores/chatStore';
import { UnreadBadge } from '../common/UnreadBadge';
import { cn } from '../../lib/utils';

// Persistent bottom tab bar for mobile — the "always there" navigation
// pattern people expect from a social app. The sidebar drawer (hamburger
// menu) still exists for less-frequent destinations like Settings/logout.
export function MobileTabBar() {
  const { currentRoute, navigate } = useUiStore();
  const { conversations } = useChatStore();

  // MessagesPage owns its own full-height, edge-to-edge layout with a
  // composer pinned to the bottom — the tab bar would sit on top of it.
  // Same pattern as WhatsApp/Instagram hiding their tab bar inside a chat.
  if (currentRoute === 'messages') return null;

  const totalUnreadMessages = conversations.reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0
  );

  const tabs: { route: AppRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { route: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { route: 'discover', label: 'Discover', icon: <Compass className="h-5 w-5" /> },
    { route: 'matches', label: 'Matches', icon: <Users className="h-5 w-5" /> },
    {
      route: 'messages',
      label: 'Chats',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: totalUnreadMessages,
    },
    { route: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/90 backdrop-blur-md border-t border-slate-200/80 flex items-stretch shadow-[0_-4px_16px_-4px_rgba(15,23,42,0.08)]">
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.route;
        return (
          <button
            key={tab.route}
            type="button"
            onClick={() => navigate(tab.route)}
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            aria-label={tab.label}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-tab-indicator"
                className="absolute top-1 h-1 w-8 rounded-full bg-indigo-600"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <motion.div
              className="relative"
              animate={isActive ? { y: -1, scale: 1.08 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className={cn(isActive ? 'text-indigo-600' : 'text-slate-400')}>
                {tab.icon}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2">
                  <UnreadBadge count={tab.badge} />
                </span>
              )}
            </motion.div>
            <span
              className={cn(
                'text-[10px] font-semibold',
                isActive ? 'text-indigo-600' : 'text-slate-400'
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
