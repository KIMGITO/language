import { create } from 'zustand';
import { Language } from '../types';
import { LANGUAGES } from '../data/mockData';

interface LanguageState {
  languages: Language[];
  activePracticeLanguage: Language | null;
  selectedSpeakerLanguage: Language | null;
  searchQuery: string;

  setActivePracticeLanguage: (lang: Language | null) => void;
  setSelectedSpeakerLanguage: (lang: Language | null) => void;
  setSearchQuery: (query: string) => void;
  getLanguageById: (id: string) => Language | undefined;
  getLanguageByCode: (code: string) => Language | undefined;
  getFilteredLanguages: () => Language[];
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  languages: LANGUAGES,
  activePracticeLanguage: LANGUAGES[0], // Default to English
  selectedSpeakerLanguage: null,
  searchQuery: '',

  setActivePracticeLanguage: (lang: Language | null) => {
    set({ activePracticeLanguage: lang });
  },

  setSelectedSpeakerLanguage: (lang: Language | null) => {
    set({ selectedSpeakerLanguage: lang });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getLanguageById: (id: string) => {
    return get().languages.find((l) => l.id === id);
  },

  getLanguageByCode: (code: string) => {
    return get().languages.find((l) => l.code === code);
  },

  getFilteredLanguages: () => {
    const { languages, searchQuery } = get();
    if (!searchQuery.trim()) return languages;
    const q = searchQuery.toLowerCase().trim();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  },
}));
