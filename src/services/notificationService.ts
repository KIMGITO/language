import { supabase, isSupabaseConfigured } from './supabase';
import type { Notification } from '../types';

export const notificationService = {
  // ---------------------------------------------------------------
  // Fetch notifications for a user (most recent first)
  // ---------------------------------------------------------------
  async fetchNotifications(userId: string, limit = 30): Promise<Notification[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, user_id, type, title, body, read, link, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (data ?? []) as Notification[];
      } catch (e) {
        console.warn('[notificationService] fetchNotifications error:', e);
      }
    }
    return [];
  },

  // ---------------------------------------------------------------
  // Mark a single notification as read
  // ---------------------------------------------------------------
  async markRead(notificationId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId);
      } catch (e) {
        console.warn('[notificationService] markRead error:', e);
      }
    }
  },

  // ---------------------------------------------------------------
  // Mark all notifications as read for a user
  // ---------------------------------------------------------------
  async markAllRead(userId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', userId)
          .eq('read', false);
      } catch (e) {
        console.warn('[notificationService] markAllRead error:', e);
      }
    }
  },

  // ---------------------------------------------------------------
  // Subscribe to new notifications via Realtime
  // ---------------------------------------------------------------
  subscribeToNotifications(userId: string, onNotification: (n: Notification) => void): () => void {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) onNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  },

  // ---------------------------------------------------------------
  // Get unread count via SQL function
  // ---------------------------------------------------------------
  async getUnreadMessageCount(userId: string): Promise<number> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('get_unread_count', { p_user_id: userId });
        if (!error && data !== null) return data as number;
      } catch (e) {
        console.warn('[notificationService] getUnreadCount error:', e);
      }
    }
    return 0;
  },
};
