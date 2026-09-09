import { create } from 'zustand';
import { ConversationTopic } from '../types';
import { CONVERSATION_TOPICS } from '../data/mockData';

export const TOPIC_CATEGORIES = [
  'All',
  'Everyday Life',
  'Food',
  'Travel',
  'Culture',
  'Music',
  'Movies',
  'Technology',
  'Work',
  'Hobbies',
  'Education',
] as const;

export type TopicCategory = typeof TOPIC_CATEGORIES[number];

interface TopicState {
  topics: ConversationTopic[];
  selectedCategory: TopicCategory;
  searchQuery: string;
  selectedTopic: ConversationTopic | null;
  isPanelOpen: boolean;

  setCategory: (category: TopicCategory) => void;
  setSearchQuery: (query: string) => void;
  selectTopic: (topic: ConversationTopic | null) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
  getRandomTopic: (category?: TopicCategory) => ConversationTopic;
  getFilteredTopics: () => ConversationTopic[];
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: CONVERSATION_TOPICS,
  selectedCategory: 'All',
  searchQuery: '',
  selectedTopic: null,
  isPanelOpen: false,

  setCategory: (category: TopicCategory) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  selectTopic: (topic: ConversationTopic | null) => {
    set({ selectedTopic: topic });
  },

  togglePanel: () => {
    set((state) => ({ isPanelOpen: !state.isPanelOpen }));
  },

  setPanelOpen: (open: boolean) => {
    set({ isPanelOpen: open });
  },

  getRandomTopic: (category?: TopicCategory) => {
    const { topics } = get();
    const pool = category && category !== 'All' 
      ? topics.filter((t) => t.category.toLowerCase() === category.toLowerCase())
      : topics;
    const finalPool = pool.length > 0 ? pool : topics;
    const index = Math.floor(Math.random() * finalPool.length);
    return finalPool[index];
  },

  getFilteredTopics: () => {
    const { topics, selectedCategory, searchQuery } = get();
    return topics.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        topic.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.prompt.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  },
}));
