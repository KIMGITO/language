import React from 'react';
import { Menu, Bell, Globe2, CheckCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useProfileStore } from '../../stores/profileStore';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

export function TopNavigation() {
  const { setMobileNavOpen, navigate, sidebarCollapsed, toggleSidebar } = useUiStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isOpen, setIsOpen } =
    useNotificationStore();
  const { currentProfile } = useProfileStore();

  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between glass-header px-4 sm:px-6">
      {/* Drawer & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile toggle button */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop & Tablet Sidebar Collapse/Expand Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60 shadow-xs"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 text-indigo-600" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <div
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 cursor-pointer md:hidden"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
            <Globe2 className="h-5 w-5 text-amber-300" />
          </div>
          <span className="font-heading font-bold text-base text-slate-900 tracking-tight">
            LinguaConnect
          </span>
        </div>
      </div>

      {/* Right Controls: Notifications & User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200/60"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xl z-50 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <Badge variant="amber" className="text-[10px]">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) {
                          if (n.link.startsWith('/users/')) {
                            const uid = n.link.replace('/users/', '');
                            navigate('user-profile', { userId: uid });
                          } else if (n.link === '/messages') {
                            navigate('messages');
                          } else {
                            navigate('home');
                          }
                          setIsOpen(false);
                        }
                      }}
                      className={cn(
                        'p-3 rounded-xl border text-left cursor-pointer transition-all duration-150',
                        n.read
                          ? 'bg-slate-50/50 border-slate-100 text-slate-500'
                          : 'bg-indigo-50/70 border-indigo-200/80 text-slate-900 shadow-xs'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading font-bold text-xs text-slate-900">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {new Date(n.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-slate-400 font-medium">
                    No new notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar header pill */}
        {currentProfile && (
          <div
            onClick={() => navigate('profile')}
            className="flex items-center gap-2.5 pl-3 py-1 border-l border-slate-200/80 cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <Avatar
              src={currentProfile.avatar_url}
              fallback={currentProfile.display_name.charAt(0)}
              size="sm"
              isOnline={true}
            />
            <span className="hidden sm:inline font-heading font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">
              {currentProfile.display_name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

