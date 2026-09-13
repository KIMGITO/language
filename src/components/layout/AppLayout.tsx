import React from 'react';
import { AppSidebar } from './AppSidebar';
import { TopNavigation } from './TopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { MobileTabBar } from './MobileTabBar';
import { ReportDialog } from '../safety/ReportDialog';
import { BlockUserDialog } from '../safety/BlockUserDialog';
import { useSafetyStore } from '../../stores/safetyStore';
import { useUiStore } from '../../stores/uiStore';
import { useProfileStore } from '../../stores/profileStore';
import { useChatStore } from '../../stores/chatStore';
import { cn } from '../../lib/utils';
import { CheckCircle2, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { toastMessage, clearToast } = useSafetyStore();
  const { currentRoute } = useUiStore();
  const { currentProfile } = useProfileStore();
  const { loadConversations, subscribeConversations } = useChatStore();
  const isMessages = currentRoute === 'messages';

  // Single app-wide conversation subscription lifecycle, tied to the
  // logged-in session rather than whichever page happens to be mounted —
  // this is what makes unread badges in the sidebar/tab bar update live
  // and lets a brand-new incoming conversation appear without a manual
  // refresh, regardless of which page you're currently on.
  React.useEffect(() => {
    if (!currentProfile?.id) return;
    loadConversations(currentProfile.id);
    subscribeConversations(currentProfile.id);
    return () => {
      const unsub = useChatStore.getState().unsubscribeConvList;
      if (unsub) unsub();
    };
  }, [currentProfile?.id]);

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Persistent Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Drawer Navigation (secondary destinations: settings, logout) */}
      <MobileNavigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNavigation />

        {/* Floating Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 max-w-md rounded-2xl bg-white text-slate-900 p-4 shadow-2xl flex items-start gap-3 border border-slate-200/80 animate-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm leading-relaxed font-medium">
              {toastMessage}
            </div>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className={cn('flex-1', isMessages ? '' : 'pb-16 md:pb-8')}>
          {children}
        </main>
      </div>

      {/* Persistent Mobile Bottom Tab Bar (hidden inside an open chat) */}
      <MobileTabBar />

      {/* Global Safety Dialogs */}
      <ReportDialog />
      <BlockUserDialog />
    </div>
  );
}

