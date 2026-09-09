import { supabase, isSupabaseConfigured, callEdgeFunction } from './supabase';
import type { Block, Report } from '../types';

export const safetyService = {
  // ---------------------------------------------------------------
  // Block a user (via Edge Function for secure cleanup)
  // ---------------------------------------------------------------
  async blockUser(blockerId: string, blockedId: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      const { data, error } = await callEdgeFunction('block-user', { blocked_id: blockedId });
      if (error) return { success: false, error };
      return { success: true };
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 200));
    return { success: true };
  },

  // ---------------------------------------------------------------
  // Unblock a user
  // ---------------------------------------------------------------
  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('blocks')
          .delete()
          .match({ blocker_id: blockerId, blocked_id: blockedId });
      } catch (e) {
        console.warn('[safetyService] unblockUser error:', e);
      }
    }
  },

  // ---------------------------------------------------------------
  // Fetch all blocked user IDs for a user
  // ---------------------------------------------------------------
  async fetchBlockedUsers(userId: string): Promise<string[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blocks')
          .select('blocked_id')
          .eq('blocker_id', userId);

        if (error) throw error;
        return (data ?? []).map((b) => b.blocked_id);
      } catch (e) {
        console.warn('[safetyService] fetchBlockedUsers error:', e);
      }
    }
    return [];
  },

  // ---------------------------------------------------------------
  // Fetch blocked user profiles (for settings page)
  // ---------------------------------------------------------------
  async fetchBlockedProfiles(userId: string): Promise<{ id: string; display_name: string; avatar_url: string | null }[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blocks')
          .select(`
            blocked_id,
            blocked:profiles!blocked_id (id, display_name, avatar_url)
          `)
          .eq('blocker_id', userId);

        if (error) throw error;
        return (data ?? []).map((row: any) => ({
          id:            row.blocked_id,
          display_name:  row.blocked?.display_name ?? 'Unknown',
          avatar_url:    row.blocked?.avatar_url ?? null,
        }));
      } catch (e) {
        console.warn('[safetyService] fetchBlockedProfiles error:', e);
      }
    }
    return [];
  },

  // ---------------------------------------------------------------
  // Report a user
  // ---------------------------------------------------------------
  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: Report['reason'],
    description?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reports').insert({
          reporter_id:      reporterId,
          reported_user_id: reportedUserId,
          reason,
          description:      description ?? null,
          status:           'pending',
        });

        if (error) throw error;
        return { success: true };
      } catch (e: unknown) {
        return { success: false, error: e instanceof Error ? e.message : 'Report failed' };
      }
    }

    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  },
};
