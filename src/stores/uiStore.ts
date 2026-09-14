import { create } from 'zustand';

const THEME_STORAGE_KEY = 'linguaconnect-theme';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

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
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  currentRoute: 'home',
  currentRouteParams: {},
  selectedUserId: null,
  selectedConversationId: null,
  sidebarCollapsed: false,
  mobileNavOpen: false,
  rightPanelOpen: true,
  theme: getInitialTheme(),

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

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));

// Apply the resolved theme immediately on module load (before first paint
// as much as possible), rather than waiting for a component to mount.
applyTheme(useUiStore.getState().theme);
