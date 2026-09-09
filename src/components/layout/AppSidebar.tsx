import React from 'react';
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  User,
  Settings,
  Globe2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useUiStore, AppRoute } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { useChatStore } from '../../stores/chatStore';
import { Avatar } from '../ui/avatar';
import { UnreadBadge } from '../common/UnreadBadge';
import { cn } from '../../lib/utils';

export function AppSidebar() {
  const { currentRoute, navigate, sidebarCollapsed, toggleSidebar } = useUiStore();
  const { logout } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { conversations } = useChatStore();

  const totalUnreadMessages = conversations.reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0
  );

  const navItems: { route: AppRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { route: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { route: 'discover', label: 'Discover', icon: <Compass className="h-5 w-5" /> },
    { route: 'matches', label: 'Matches', icon: <Users className="h-5 w-5" /> },
    {
      route: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: totalUnreadMessages,
    },
    { route: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
    { route: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white/90 backdrop-blur-md border-r border-slate-200/80 transition-all duration-200 z-30 select-none shadow-xs',
        sidebarCollapsed ? 'w-20 px-2 py-4' : 'w-64 px-4 py-5'
      )}
    >
      <div>
        {/* Brand logo & header */}
        <div className="flex items-center justify-between gap-2 px-2 mb-8">
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Globe2 className="h-5 w-5 text-amber-300" />
            </div>

            {!sidebarCollapsed && (
              <div>
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight leading-none block">
                  LinguaConnect
                </span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mt-1">
                  Language Exchange
                </span>
              </div>
            )}
          </div>

          
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                className={cn(
                  'w-full flex items-center font-semibold text-sm transition-all duration-150 cursor-pointer group relative',
                  sidebarCollapsed
                    ? 'justify-center p-3 rounded-2xl'
                    : 'justify-between px-3.5 py-2.5 rounded-xl',
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    )}
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <div>
                    <UnreadBadge count={item.badge} />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="pt-4 border-t border-slate-100">
        {currentProfile && (
          <div
            className={cn(
              'flex items-center rounded-2xl p-2 transition-all hover:bg-slate-100/80 border border-transparent hover:border-slate-200/60',
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div
              onClick={() => navigate('profile')}
              className="flex items-center gap-3 cursor-pointer min-w-0"
            >
              <Avatar
                src={currentProfile.avatar_url}
                fallback={currentProfile.display_name.charAt(0)}
                size="sm"
                isOnline={true}
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="font-heading font-bold text-xs text-slate-900 truncate">
                    {currentProfile.display_name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentProfile.country}
                  </p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('landing');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

