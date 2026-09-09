import { create } from 'zustand';
import { authService, onAuthStateChange } from '../services/authService';
import type { AuthUser, AuthSession } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  checkSession:   () => Promise<void>;
  login:          (email: string, pass: string) => Promise<boolean>;
  register:       (name: string, email: string, pass: string) => Promise<boolean>;
  logout:         () => Promise<void>;
  resetPassword:  (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateEmail:    (newEmail: string) => Promise<boolean>;
  clearError:     () => void;

  // Internal — called by auth state listener
  _setAuth: (user: AuthUser | null, session: AuthSession | null) => void;
}

// Cleanup fn for the auth listener
let unsubscribeAuthListener: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user:        null,
  session:     null,
  initialized: false,
  loading:     false,
  error:       null,

  _setAuth: (user, session) => set({ user, session }),

  // ---------------------------------------------------------------
  initializeAuth: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });

    try {
      // Get current session
      const res = await authService.getInitialSession();
      set({ user: res.user, session: res.session, initialized: true, loading: false });

      // Start listening for future auth changes (login, logout, token refresh)
      if (unsubscribeAuthListener) unsubscribeAuthListener();
      unsubscribeAuthListener = onAuthStateChange((user, session) => {
        get()._setAuth(user, session);
      });
    } catch (err: unknown) {
      set({
        initialized: true,
        loading:     false,
        error:       err instanceof Error ? err.message : 'Auth initialization failed',
      });
    }
  },

  checkSession: async () => {
    await get().initializeAuth();
  },

  // ---------------------------------------------------------------
  login: async (email, pass) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(email, pass);
      if (res.error) {
        set({ error: res.error, loading: false });
        return false;
      }
      set({ user: res.user, session: res.session, loading: false, error: null });
      return true;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Login failed', loading: false });
      return false;
    }
  },

  // ---------------------------------------------------------------
  register: async (name, email, pass) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(name, email, pass);
      if (res.error) {
        set({ error: res.error, loading: false });
        return false;
      }
      set({ user: res.user, session: res.session, loading: false, error: null });
      return true;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Registration failed', loading: false });
      return false;
    }
  },

  // ---------------------------------------------------------------
  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      if (unsubscribeAuthListener) {
        unsubscribeAuthListener();
        unsubscribeAuthListener = null;
      }
      set({ user: null, session: null, loading: false, error: null });
    } catch {
      set({ loading: false });
    }
  },

  // ---------------------------------------------------------------
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.resetPassword(email);
      set({ loading: false });
      return res.success;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Reset failed', loading: false });
      return false;
    }
  },

  // ---------------------------------------------------------------
  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.updatePassword(newPassword);
      set({ loading: false });
      if (!res.success) set({ error: res.error ?? 'Update failed' });
      return res.success;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Update failed', loading: false });
      return false;
    }
  },

  // ---------------------------------------------------------------
  updateEmail: async (newEmail) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.updateEmail(newEmail);
      set({ loading: false });
      if (!res.success) set({ error: res.error ?? 'Update failed' });
      return res.success;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Update failed', loading: false });
      return false;
    }
  },

  // ---------------------------------------------------------------
  clearError: () => set({ error: null }),
}));
