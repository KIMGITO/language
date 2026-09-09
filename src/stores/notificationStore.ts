import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';

interface NotificationState {
  notifications:      Notification[];
  unreadCount:        number;
  unreadMessageCount: number;
  loading:            boolean;

  fetchNotifications:      (userId: string) => Promise<void>;
  markRead:                (notificationId: string) => Promise<void>;
  markAllRead:             (userId: string) => Promise<void>;
  addNotification:         (n: Notification) => void;
  subscribeToNotifications:(userId: string) => () => void;
  fetchUnreadMessageCount: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications:      [],
  unreadCount:        0,
  unreadMessageCount: 0,
  loading:            false,

  // ---------------------------------------------------------------
  fetchNotifications: async (userId) => {
    set({ loading: true });
    try {
      const notifications = await notificationService.fetchNotifications(userId);
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        loading:     false,
      });
    } catch {
      set({ loading: false });
    }
  },

  // ---------------------------------------------------------------
  markRead: async (notificationId) => {
    await notificationService.markRead(notificationId);
    set((state) => ({
      notifications:  state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  // ---------------------------------------------------------------
  markAllRead: async (userId) => {
    await notificationService.markAllRead(userId);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount:   0,
    }));
  },

  // ---------------------------------------------------------------
  addNotification: (n) => {
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount:   state.unreadCount + (n.read ? 0 : 1),
    }));
  },

  // ---------------------------------------------------------------
  subscribeToNotifications: (userId) => {
    return notificationService.subscribeToNotifications(userId, (n) => {
      get().addNotification(n);
    });
  },

  // ---------------------------------------------------------------
  fetchUnreadMessageCount: async (userId) => {
    const count = await notificationService.getUnreadMessageCount(userId);
    set({ unreadMessageCount: count });
  },
}));
