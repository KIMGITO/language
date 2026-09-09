import { create } from 'zustand';
import { Profile, OnboardingData, Language } from '../types';
import { profileService } from '../services/profileService';
import { MOCK_CURRENT_USER, MOCK_PARTNERS } from '../data/mockData';
import { isSupabaseConfigured } from '../services/supabase';

interface ProfileState {
  currentProfile: Profile | null;
  viewedProfile: Profile | null;
  availableLanguages: Language[];
  availableInterests: { id: string; name: string; category?: string }[];
  avatarUploading: boolean;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  onboardingStep: number;
  onboardingData: OnboardingData;

  getPartnerProfile: (userId: string) => Profile | undefined;
  fetchCurrentProfile: (userId?: string) => Promise<void>;
  fetchViewedProfile: (userId: string) => Promise<void>;
  updateCurrentProfile: (updates: Partial<Profile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: (payload: string | Partial<Profile>) => Promise<boolean>;
  setIsEditing: (editing: boolean) => void;
  clearError: () => void;
}

const initialOnboardingData: OnboardingData = {
  nativeLanguages: [{ languageId: 'lang-en', proficiency: 'Native' }],
  learningLanguages: [{ languageId: 'lang-es', proficiency: 'Intermediate' }],
  communityIntent: ['practice', 'language_exchange'],
  interests: ['Travel', 'Food & Cooking', 'Music', 'Culture & Traditions'],
  bio: 'Excited to practice conversational speech and explore cultural exchange!',
  country: 'United States',
  availability: 'Weekday evenings (18:00 - 21:00)',
  learningGoal: 'Conversational fluency & everyday idioms',
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  currentProfile: isSupabaseConfigured ? null : MOCK_CURRENT_USER,
  viewedProfile: null,
  availableLanguages: [],
  availableInterests: [],
  avatarUploading: false,
  loading: false,
  error: null,
  isEditing: false,
  onboardingStep: 1,
  onboardingData: initialOnboardingData,

  fetchCurrentProfile: async (userId?: string) => {
    const id = userId || get().currentProfile?.id || MOCK_CURRENT_USER.id;
    set({ loading: true, error: null });
    try {
      const [profile, langs, interests] = await Promise.all([
        profileService.getProfile(id),
        profileService.getLanguages(),
        profileService.getInterests(),
      ]);
      set({
        currentProfile: profile,
        availableLanguages: langs,
        availableInterests: interests,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load profile',
      });
    }
  },

  fetchViewedProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profile = await profileService.getProfile(userId);
      set({ viewedProfile: profile ?? null, loading: false });
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load partner profile',
      });
    }
  },

  updateCurrentProfile: async (updates: Partial<Profile>) => {
    const userId = get().currentProfile?.id || MOCK_CURRENT_USER.id;
    set({ loading: true, error: null });
    try {
      const updated = await profileService.updateProfile(userId, updates);
      set({ currentProfile: updated, loading: false, isEditing: false });
      return true;
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to update profile',
      });
      return false;
    }
  },

  uploadAvatar: async (file: File) => {
    const userId = get().currentProfile?.id || MOCK_CURRENT_USER.id;
    set({ avatarUploading: true });
    try {
      const { url, error } = await profileService.uploadAvatar(userId, file);
      if (error || !url) {
        set({ avatarUploading: false });
        return null;
      }
      // Persist avatar URL to profile
      await profileService.updateProfile(userId, { avatar_url: url });
      set((state) => ({
        avatarUploading: false,
        currentProfile: state.currentProfile ? { ...state.currentProfile, avatar_url: url } : null,
      }));
      return url;
    } catch {
      set({ avatarUploading: false });
      return null;
    }
  },

  getPartnerProfile: (userId: string) => {
    if (userId === get().currentProfile?.id) return get().currentProfile || undefined;
    return MOCK_PARTNERS.find((p) => p.id === userId);
  },

  setOnboardingStep: (step: number) => {
    set({ onboardingStep: step });
  },

  updateOnboardingData: (data: Partial<OnboardingData>) => {
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data },
    }));
  },

  completeOnboarding: async (payload: string | Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      if (typeof payload === 'string') {
        const updated = await profileService.saveOnboardingProfile(payload, get().onboardingData);
        set({ currentProfile: updated, loading: false, onboardingStep: 1 });
        return true;
      } else {
        const userId = get().currentProfile?.id || MOCK_CURRENT_USER.id;
        const current = get().currentProfile || MOCK_CURRENT_USER;
        const merged: Profile = { ...current, ...payload, onboarding_completed: true };
        const updated = await profileService.updateProfile(userId, merged);
        set({ currentProfile: updated, loading: false, onboardingStep: 1 });
        return true;
      }
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to finish onboarding',
      });
      return false;
    }
  },

  setIsEditing: (isEditing: boolean) => set({ isEditing }),
  clearError: () => set({ error: null }),
}));
