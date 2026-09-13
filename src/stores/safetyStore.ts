import { create } from 'zustand';
import { Profile, Report } from '../types';
import { safetyService } from '../services/safetyService';
import { useProfileStore } from './profileStore';
import { isSupabaseConfigured } from '../services/supabase';

interface SafetyState {
  blockedUserIds: string[];
  blockedUsers: { blocked_user_id: string; blocked_name: string; avatar_url?: string | null }[];
  reportDialogOpen: boolean;
  blockDialogOpen: boolean;
  targetUser: Profile | null;
  reportReason: Report['reason'];
  reportDescription: string;
  isSubmitting: boolean;
  toastMessage: string | null;

  openReportDialog: (user: Profile) => void;
  closeReportDialog: () => void;
  openBlockDialog: (user: Profile) => void;
  closeBlockDialog: () => void;
  setReportReason: (reason: Report['reason']) => void;
  setReportDescription: (desc: string) => void;
  submitReport: () => Promise<boolean>;
  confirmBlock: () => Promise<boolean>;
  unblockUser: (blockedId: string) => Promise<void>;
  fetchBlockedUsers: () => Promise<void>;
  fetchBlockedProfiles: () => Promise<void>;
  clearToast: () => void;
}

export const useSafetyStore = create<SafetyState>((set, get) => ({
  blockedUserIds: [],
  blockedUsers: [],
  reportDialogOpen: false,
  blockDialogOpen: false,
  targetUser: null,
  reportReason: 'Harassment',
  reportDescription: '',
  isSubmitting: false,
  toastMessage: null,

  openReportDialog: (user: Profile) => {
    set({
      reportDialogOpen: true,
      targetUser: user,
      reportReason: 'Harassment',
      reportDescription: '',
    });
  },

  closeReportDialog: () => {
    set({ reportDialogOpen: false, targetUser: null });
  },

  openBlockDialog: (user: Profile) => {
    set({
      blockDialogOpen: true,
      targetUser: user,
    });
  },

  closeBlockDialog: () => {
    set({ blockDialogOpen: false, targetUser: null });
  },

  setReportReason: (reason) => set({ reportReason: reason }),
  setReportDescription: (desc) => set({ reportDescription: desc }),

  submitReport: async () => {
    const { targetUser, reportReason, reportDescription } = get();
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!targetUser || !currentProfile) return false;

    set({ isSubmitting: true });
    try {
      await safetyService.reportUser(
        currentProfile.id,
        targetUser.id,
        reportReason,
        reportDescription
      );
      set({
        isSubmitting: false,
        reportDialogOpen: false,
        targetUser: null,
        toastMessage: `Thank you. Your report against ${targetUser.display_name} has been submitted for review.`,
      });
      return true;
    } catch (err) {
      set({ isSubmitting: false });
      return false;
    }
  },

  confirmBlock: async () => {
    const { targetUser } = get();
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!targetUser || !currentProfile) return false;

    set({ isSubmitting: true });
    try {
      await safetyService.blockUser(currentProfile.id, targetUser.id);
      set((state) => ({
        blockedUserIds: [...state.blockedUserIds, targetUser.id],
        blockedUsers: [
          ...state.blockedUsers.filter((b) => b.blocked_user_id !== targetUser.id),
          { blocked_user_id: targetUser.id, blocked_name: targetUser.display_name },
        ],
        isSubmitting: false,
        blockDialogOpen: false,
        targetUser: null,
        toastMessage: `${targetUser.display_name} has been blocked. They will no longer appear in your recommendations or messages.`,
      }));
      return true;
    } catch (err) {
      set({ isSubmitting: false });
      return false;
    }
  },

  unblockUser: async (blockedId: string) => {
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!currentProfile) return;
    const { success } = await safetyService.unblockUser(currentProfile.id, blockedId);
    if (!success) {
      set({ toastMessage: 'Could not unblock — please try again.' });
      return;
    }
    set((state) => ({
      blockedUserIds: state.blockedUserIds.filter((id) => id !== blockedId),
      blockedUsers: state.blockedUsers.filter((b) => b.blocked_user_id !== blockedId),
      toastMessage: 'User has been unblocked.',
    }));
  },

  fetchBlockedUsers: async () => {
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!currentProfile) return;
    const ids = await safetyService.fetchBlockedUsers(currentProfile.id);
    set({ blockedUserIds: ids });
  },

  // Populates the full list (name + avatar) shown in Settings. In demo
  // mode this intentionally leaves whatever confirmBlock has built up
  // locally during the session rather than overwriting it with an empty
  // server response — there's no backing table to actually read from.
  fetchBlockedProfiles: async () => {
    if (!isSupabaseConfigured) return;
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!currentProfile) return;
    const profiles = await safetyService.fetchBlockedProfiles(currentProfile.id);
    set({
      blockedUserIds: profiles.map((p) => p.id),
      blockedUsers: profiles.map((p) => ({
        blocked_user_id: p.id,
        blocked_name: p.display_name,
        avatar_url: p.avatar_url,
      })),
    });
  },

  clearToast: () => set({ toastMessage: null }),
}));
