import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { Sheet } from '../ui/sheet';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

// Primary navigation (Home/Discover/Matches/Messages/Profile) lives in the
// persistent mobile tab bar now. This drawer just covers the leftover
// secondary destination (Settings) plus logout.
export function MobileNavigation() {
  const { mobileNavOpen, setMobileNavOpen, currentRoute, navigate } = useUiStore();
  const { logout } = useAuthStore();
  const { currentProfile } = useProfileStore();

  return (
    <Sheet
      open={mobileNavOpen}
      onOpenChange={setMobileNavOpen}
      side="left"
      title="Menu"
      className="max-w-xs"
    >
      <div className="flex flex-col justify-between h-[calc(100vh-100px)]">
        <div>
          {/* User badge */}
          {currentProfile && (
            <div
              onClick={() => {
                navigate('profile');
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 mb-6 cursor-pointer"
            >
              <Avatar
                src={currentProfile.avatar_url}
                fallback={currentProfile.display_name.charAt(0)}
                size="md"
                isOnline={true}
              />
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm text-slate-900 truncate">
                  {currentProfile.display_name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentProfile.country}
                </p>
              </div>
            </div>
          )}

          {/* Secondary links */}
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                navigate('settings');
                setMobileNavOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all text-left cursor-pointer',
                currentRoute === 'settings'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Settings className={cn('h-5 w-5', currentRoute === 'settings' ? 'text-white' : 'text-slate-400')} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={async () => {
              await logout();
              setMobileNavOpen(false);
              navigate('landing');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </Sheet>
  );
}

