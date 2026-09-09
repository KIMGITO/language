import { create } from 'zustand';

export type AppRoute = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'onboarding' 
  | 'home' 
  | 'discover' 
  | 'matches' 
  | 'messages' 
  | 'profile' 
  | 'user-profile' 
  | 'settings';

interface UiState {
  currentRoute: AppRoute;
  currentRouteParams: { userId?: string; conversationId?: string };
  selectedUserId: string | null;
  selectedConversationId: string | null;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  rightPanelOpen: boolean;
  theme: 'light' | 'dark';

  navigate: (route: AppRoute, params?: { userId?: string; conversationId?: string }) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentRoute: 'home',
  currentRouteParams: {},
  selectedUserId: null,
  selectedConversationId: null,
  sidebarCollapsed: false,
  mobileNavOpen: false,
  rightPanelOpen: true,
  theme: 'light',

  navigate: (route, params) => {
    set({
      currentRoute: route,
      currentRouteParams: params || {},
      selectedUserId: params?.userId || null,
      selectedConversationId: params?.conversationId || null,
      mobileNavOpen: false, // Auto-close drawer on navigation
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
}));
