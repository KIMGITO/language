import { create } from 'zustand';
import { PartnerMatch, MatchFilters } from '../types';
import { matchingService } from '../services/matchingService';
import { useProfileStore } from './profileStore';

interface MatchingState {
  matches: PartnerMatch[];
  discoverList: PartnerMatch[];
  filteredMatches: PartnerMatch[];
  filters: MatchFilters;
  loading: boolean;
  error: string | null;

  loadMatches: (userId?: string) => Promise<void>;
  fetchMatches: (userId?: string) => Promise<void>;
  fetchDiscover: () => Promise<void>;
  setFilter: (key: keyof MatchFilters, value: string) => void;
  resetFilters: () => void;
  connectPartner: (partnerId: string) => Promise<boolean>;
  skipPartner: (partnerId: string) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: MatchFilters = {
  practiceLanguage: 'all',
  speakerLanguage: 'all',
  proficiency: 'all',
  interest: 'all',
  availability: 'all',
  country: 'all',
  searchQuery: '',
};

export const useMatchingStore = create<MatchingState>((set, get) => ({
  matches: [],
  discoverList: [],
  filteredMatches: [],
  filters: defaultFilters,
  loading: false,
  error: null,

  loadMatches: async (userId?: string) => {
    await get().fetchMatches(userId);
    await get().fetchDiscover();
  },

  fetchMatches: async (userId?: string) => {
    set({ loading: true, error: null });
    try {
      const currentProfile = useProfileStore.getState().currentProfile;
      const id = userId || currentProfile?.id || 'user-alex-demo';
      const data = await matchingService.fetchMatches(id);
      set({ matches: data, loading: false });
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch matches',
      });
    }
  },

  fetchDiscover: async () => {
    set({ loading: true, error: null });
    try {
      const currentProfile = useProfileStore.getState().currentProfile;
      const data = await matchingService.discoverPartners(get().filters, currentProfile || undefined);
      set({ discoverList: data, filteredMatches: data, loading: false });
    } catch (err: unknown) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to discover partners',
      });
    }
  },

  setFilter: (key: keyof MatchFilters, value: string) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchDiscover();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchDiscover();
  },

  connectPartner: async (partnerId: string) => {
    try {
      const currentProfile = useProfileStore.getState().currentProfile;
      const res = await matchingService.connectPartner(currentProfile?.id || 'user-alex-demo', partnerId);
      if (res) {
        set((state) => ({
          matches: [res, ...state.matches.filter((m) => m.matched_user_id !== partnerId)],
          discoverList: state.discoverList.map((m) =>
            m.matched_user_id === partnerId ? { ...m, status: 'connected' } : m
          ),
        }));
        return true;
      }
      return false;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Failed to connect' });
      return false;
    }
  },

  skipPartner: async (partnerId: string) => {
    const currentProfile = useProfileStore.getState().currentProfile;
    await matchingService.skipPartner(currentProfile?.id || 'user-alex-demo', partnerId);
    set((state) => ({
      discoverList: state.discoverList.filter((m) => m.matched_user_id !== partnerId),
    }));
  },

  clearError: () => set({ error: null }),
}));
