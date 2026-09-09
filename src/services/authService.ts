import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_CURRENT_USER } from '../data/mockData';
import type { Profile } from '../types';

export type OAuthProvider = 'google' | 'apple' | 'facebook';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: { display_name?: string };
}

export interface AuthSession {
  access_token: string;
  expires_at?: number;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: string | null;
}

// ---------------------------------------------------------------
// Listen for auth state changes — call this ONCE at app init.
// ---------------------------------------------------------------
export function onAuthStateChange(
  callback: (user: AuthUser | null, session: AuthSession | null) => void
): () => void {
  if (!isSupabaseConfigured) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session?.user) {
        callback(
          {
            id: session.user.id,
            email: session.user.email ?? '',
            user_metadata: session.user.user_metadata,
          },
          { access_token: session.access_token, expires_at: session.expires_at }
        );
      } else {
        callback(null, null);
      }
    }
  );

  return () => subscription.unsubscribe();
}

export const authService = {
  // ---------------------------------------------------------------
  // Get current session (called once on app load)
  // ---------------------------------------------------------------
  async getInitialSession(): Promise<AuthResponse> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) return { user: null, session: null, error: error.message };
        if (data.session) {
          return {
            user: {
              id: data.session.user.id,
              email: data.session.user.email ?? '',
              user_metadata: data.session.user.user_metadata,
            },
            session: {
              access_token: data.session.access_token,
              expires_at: data.session.expires_at,
            },
            error: null,
          };
        }
        // No active session
        return { user: null, session: null, error: null };
      } catch (err: unknown) {
        return { user: null, session: null, error: err instanceof Error ? err.message : 'Session check failed' };
      }
    }

    // Demo fallback (not configured)
    return {
      user: {
        id: MOCK_CURRENT_USER.id,
        email: 'demo@language-exchange.app',
        user_metadata: { display_name: MOCK_CURRENT_USER.display_name },
      },
      session: { access_token: 'mock-session-token' },
      error: null,
    };
  },

  // ---------------------------------------------------------------
  // Login with email + password
  // ---------------------------------------------------------------
  async login(email: string, password: string): Promise<AuthResponse> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { user: null, session: null, error: error.message };
        if (data.session && data.user) {
          return {
            user: {
              id: data.user.id,
              email: data.user.email ?? '',
              user_metadata: data.user.user_metadata,
            },
            session: { access_token: data.session.access_token, expires_at: data.session.expires_at },
            error: null,
          };
        }
        return { user: null, session: null, error: 'Login failed — no session returned.' };
      } catch (err: unknown) {
        return { user: null, session: null, error: err instanceof Error ? err.message : 'Login failed' };
      }
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 400));
    if (email && password.length >= 6) {
      return {
        user: { id: MOCK_CURRENT_USER.id, email, user_metadata: { display_name: 'Demo User' } },
        session: { access_token: 'mock-token' },
        error: null,
      };
    }
    return { user: null, session: null, error: 'Invalid credentials. Password must be at least 6 characters.' };
  },

  // ---------------------------------------------------------------
  // Register new user
  // ---------------------------------------------------------------
  async register(displayName: string, email: string, password: string): Promise<AuthResponse> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });
        if (error) return { user: null, session: null, error: error.message };
        if (data.user) {
          return {
            user: {
              id: data.user.id,
              email: data.user.email ?? '',
              user_metadata: { display_name: displayName },
            },
            session: data.session
              ? { access_token: data.session.access_token, expires_at: data.session.expires_at }
              : null,
            error: null,
          };
        }
        return { user: null, session: null, error: 'Registration failed — no user returned.' };
      } catch (err: unknown) {
        return { user: null, session: null, error: err instanceof Error ? err.message : 'Registration failed' };
      }
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 500));
    return {
      user: { id: `user-${Date.now()}`, email, user_metadata: { display_name: displayName } },
      session: { access_token: 'new-user-mock-token' },
      error: null,
    };
  },

  // ---------------------------------------------------------------
  // Sign in with a social provider (Google, Apple, Facebook)
  // Redirects the browser to the provider, then back to `redirectPath`.
  // Session is picked up automatically by supabase-js (detectSessionInUrl)
  // and surfaced through onAuthStateChange — no further handling needed.
  // ---------------------------------------------------------------
  async loginWithOAuth(
    provider: OAuthProvider,
    redirectPath: string = '/'
  ): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) {
      return {
        error: `Social sign-in with ${provider} requires Supabase to be configured for this project.`,
      };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
          ...(provider === 'google'
            ? { queryParams: { access_type: 'offline', prompt: 'consent' } }
            : {}),
        },
      });
      if (error) return { error: error.message };
      // Browser is being redirected to the provider — nothing else to do.
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : `${provider} sign-in failed` };
    }
  },

  // ---------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------
  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // ---------------------------------------------------------------
  // Send password reset email
  // ---------------------------------------------------------------
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    await new Promise((r) => setTimeout(r, 400));
    return { success: true };
  },

  // ---------------------------------------------------------------
  // Update password (user must be logged in)
  // ---------------------------------------------------------------
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  },

  // ---------------------------------------------------------------
  // Update email (user must be logged in)
  // ---------------------------------------------------------------
  async updateEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  },
};
